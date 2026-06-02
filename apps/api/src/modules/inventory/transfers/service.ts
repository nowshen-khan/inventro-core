import { transferRepository } from "./repository";
import { InventoryStockService } from "../stock/stock.service";
import { prisma } from "@/core/database/prisma";
import { AppError } from "@/core/errors/AppError";

export class TransferService {
  constructor(private inventory: InventoryStockService) {}

  async create(data: any, userId: string) {
    // Only creates PENDING transfer, no stock movement yet
    return transferRepository.create(data);
  }

  async approve(transferId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const transfer = await tx.transfer.findUniqueOrThrow({
        where: { id: transferId },
        include: { items: true, sourceWarehouse: true, destWarehouse: true },
      });
      if (transfer.status !== "PENDING")
        throw new AppError("Transfer cannot be approved", 400);
      for (const item of transfer.items) {
        // decrease source
        await this.inventoryService.decreaseStock(
          tx,
          item.productVariantId,
          transfer.sourceWarehouse.branchId,
          transfer.sourceWarehouseId,
          item.quantity,
          "TRANSFER",
          transfer.id,
          userId,
        );
        // increase destination
        await this.inventoryService.increaseStock(
          tx,
          item.productVariantId,
          transfer.destWarehouse.branchId,
          transfer.destWarehouseId,
          item.quantity,
          "TRANSFER",
          transfer.id,
          userId,
        );
      }
      await tx.transfer.update({
        where: { id: transferId },
        data: { status: "COMPLETED", approvedBy: userId },
      });
    });
  }
  async getAll(filters?: any) {
    return transferRepository.findAll(filters);
  }
  async getById(id: string) {
    return transferRepository.findById(id);
  }
}
