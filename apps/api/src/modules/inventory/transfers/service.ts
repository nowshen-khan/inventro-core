import { transferRepository } from "./repository";
import type { TransferFilters } from "./repository";
import { InventoryStockService } from "../stock/stock.service";
import { prisma } from "@/core/database/prisma";
import { AppError } from "@/core/errors/AppError";
import { TransferStatus } from "@prisma/client";
import XLSX from "xlsx";

const TERMINAL_STATUSES: TransferStatus[] = [
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
];

const isReservedStatus = (status: TransferStatus) =>
  status === "PENDING" || status === "APPROVED";

export class TransferService {
  constructor(private inventory: InventoryStockService) {}

  async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      if (data.sourceLocationId === data.destLocationId) {
        throw new AppError(
          "Source and destination location cannot be same",
          400,
        );
      }

      const transfer = await tx.transfer.create({
        data: {
          transferNo: data.transferNo || (await this.generateTransferNo(tx)),
          sourceLocationId: data.sourceLocationId,
          destLocationId: data.destLocationId,
          status: data.status ?? "DRAFT",
          note: data.note,

          requestedBy: userId,
          items: { create: data.items },
        },
        include: {
          sourceLocation: true,
          destLocation: true,
          items: { include: { variant: { include: { product: true } } } },
        },
      });

      if (isReservedStatus(transfer.status)) {
        await this.reserveTransferStock(tx, transfer, userId);
      }

      await this.audit(
        tx,
        "TRANSFER_CREATED",
        transfer.id,
        null,
        {
          status: transfer.status,
          transferNo: transfer.transferNo,
        },
        userId,
      );

      return transfer;
    });
  }

  async submit(transferId: string, userId: string) {
    return this.changeStatus(transferId, "PENDING", userId, ["DRAFT"], {
      reserve: true,
    });
  }

  async approve(transferId: string, userId: string) {
    return this.changeStatus(transferId, "APPROVED", userId, ["PENDING"]);
  }

  async reject(transferId: string, userId: string) {
    return this.changeStatus(transferId, "REJECTED", userId, ["PENDING"], {
      releaseReserve: true,
    });
  }

  async cancel(transferId: string, userId: string) {
    return this.changeStatus(
      transferId,
      "CANCELLED",
      userId,
      ["DRAFT", "PENDING", "APPROVED"],
      {
        releaseReserve: true,
      },
    );
  }

  async complete(transferId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const transfer = await tx.transfer.findUniqueOrThrow({
        where: { id: transferId },
        include: { items: true, sourceLocation: true, destLocation: true },
      });
      if (transfer.status !== "APPROVED")
        throw new AppError("Only approved transfers can be completed", 400);

      for (const item of transfer.items) {
        await this.inventory.fulfillReservedStock(
          tx,
          item.productVariantId,
          transfer.sourceLocationId,
          item.quantity,
          "TRANSFER_OUT",
          transfer.id,
          userId,
        );
        // increase destination
        await this.inventory.increaseStock(
          tx,
          item.productVariantId,
          transfer.destLocationId,
          item.quantity,
          "TRANSFER_IN",
          transfer.id,
          userId,
        );
      }
      const updated = await tx.transfer.update({
        where: { id: transferId },
        data: { status: "COMPLETED", approvedBy: userId },
      });

      await this.audit(
        tx,
        "TRANSFER_COMPLETED",
        transfer.id,
        {
          status: transfer.status,
        },
        {
          status: updated.status,
        },
        userId,
      );

      return updated;
    });
  }

  async getAll(filters?: TransferFilters) {
    return transferRepository.findAll(filters);
  }

  async getById(id: string) {
    return transferRepository.findById(id);
  }

  async getAuditLogs(id: string) {
    return transferRepository.auditLogs(id);
  }

  async report(filters?: TransferFilters) {
    const transfers = await transferRepository.findAll(filters);
    const byStatus = {
      DRAFT: 0,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    let totalQuantity = 0;
    let overdueTransfers = 0;
    const now = Date.now();
    const staleDraftMs = 7 * 24 * 60 * 60 * 1000;
    const overduePendingMs = 3 * 24 * 60 * 60 * 1000;

    for (const transfer of transfers) {
      byStatus[transfer.status] += 1;
      totalQuantity += transfer.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      const ageMs = now - transfer.createdAt.getTime();
      if (
        (transfer.status === "DRAFT" && ageMs > staleDraftMs) ||
        (transfer.status === "PENDING" && ageMs > overduePendingMs)
      ) {
        overdueTransfers += 1;
      }
    }

    return {
      totalTransfers: transfers.length,
      totalQuantity,
      draftTransfers: byStatus.DRAFT,
      pendingApproval: byStatus.PENDING,
      overdueTransfers,
      byStatus,
    };
  }

  async exportExcel(filters?: TransferFilters) {
    const transfers = await transferRepository.findAll(filters);

    const rows = transfers.flatMap((transfer) =>
      transfer.items.map((item) => ({
        TRANSFER_NO: transfer.transferNo,
        STATUS: transfer.status,
        FROM: transfer.sourceLocation?.name,
        TO: transfer.destLocation?.name,
        DATE: transfer.createdAt.toISOString(),
        BARCODE: item.variant?.barcode,
        STYLE_CODE: item.variant?.product?.styleCode,
        PRODUCT: item.variant?.product?.name,
        COLOR: item.variant?.color,
        SIZE: item.variant?.size,
        QUANTITY: item.quantity,
        NOTE: transfer.note,
      })),
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transfers");

    return XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
  }

  private async changeStatus(
    transferId: string,
    status: TransferStatus,
    userId: string,
    allowedFrom: TransferStatus[],
    options: { reserve?: boolean; releaseReserve?: boolean } = {},
  ) {
    return prisma.$transaction(async (tx) => {
      const transfer = await tx.transfer.findUniqueOrThrow({
        where: { id: transferId },
        include: { items: true },
      });

      if (
        !allowedFrom.includes(transfer.status) ||
        TERMINAL_STATUSES.includes(transfer.status)
      ) {
        throw new AppError(
          `Transfer cannot move from ${transfer.status} to ${status}`,
          400,
        );
      }

      if (options.reserve) {
        await this.reserveTransferStock(tx, transfer, userId);
      }

      if (options.releaseReserve && isReservedStatus(transfer.status)) {
        await this.releaseTransferStock(tx, transfer, userId);
      }

      const updated = await tx.transfer.update({
        where: { id: transferId },
        data: {
          status,
          approvedBy: status === "APPROVED" ? userId : transfer.approvedBy,
        },
      });

      await this.audit(
        tx,
        `TRANSFER_${status}`,
        transfer.id,
        {
          status: transfer.status,
        },
        {
          status: updated.status,
        },
        userId,
      );

      return updated;
    });
  }

  private async reserveTransferStock(tx: any, transfer: any, userId: string) {
    for (const item of transfer.items) {
      await this.inventory.reserveStock(
        tx,
        item.productVariantId,
        transfer.sourceLocationId,
        item.quantity,
        transfer.id,
        userId,
      );
    }
  }

  private async releaseTransferStock(tx: any, transfer: any, userId: string) {
    for (const item of transfer.items) {
      await this.inventory.releaseReservedStock(
        tx,
        item.productVariantId,
        transfer.sourceLocationId,
        item.quantity,
        transfer.id,
        userId,
      );
    }
  }

  private async generateTransferNo(tx: any) {
    const prefix = `TR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
    await tx.$executeRaw`
      SELECT pg_advisory_xact_lock(hashtext(${prefix}))
    `;
    const lastTransfer = await tx.transfer.findFirst({
      where: { transferNo: { startsWith: prefix } },
      orderBy: { transferNo: "desc" },
    });
    const lastSequence = lastTransfer?.transferNo
      ? Number(lastTransfer.transferNo.split("-").at(-1))
      : 0;

    return `${prefix}-${String(lastSequence + 1).padStart(5, "0")}`;
  }

  private async audit(
    tx: any,
    action: string,
    entityId: string,
    oldValue: any,
    newValue: any,
    userId: string,
  ) {
    await tx.auditLog.create({
      data: {
        action,
        entity: "Transfer",
        entityId,
        oldValue,
        newValue,
        userId,
      },
    });
  }
}
