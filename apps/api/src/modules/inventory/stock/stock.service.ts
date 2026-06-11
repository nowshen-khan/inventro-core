import { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "@/core/errors/AppError";
import { MovementType } from "@repo/types/enums";

type PrismaTx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export class StockService {
  async increaseStock(
    tx: PrismaTx,
    variantId: string,
    locationId: string,
    quantity: number,
    type: MovementType,
    referenceId?: string,
    userId?: string,
  ) {
    const stock = await tx.stock.upsert({
      where: {
        productVariantId_locationId: {
          productVariantId: variantId,
          locationId,
        },
      },
      create: { productVariantId: variantId, locationId, quantity },
      update: { quantity: { increment: quantity } },
    });

    await tx.stockMovement.create({
      data: {
        stockId: stock.id,
        type,
        quantity,
        referenceType: type,
        referenceId,
        note: `${type} stock movement`,
      },
    });
    await this._audit(
      tx,
      "STOCK_INCREASE",
      stock.id,
      null,
      { quantity: stock.quantity },
      userId,
    );
    return stock;
  }

  async reserveStock(
    tx: PrismaTx,
    variantId: string,
    locationId: string,
    quantity: number,
    referenceId?: string,
    userId?: string,
  ) {
    const stock = await tx.stock.findUnique({
      where: {
        productVariantId_locationId: {
          productVariantId: variantId,
          locationId,
        },
      },
    });
    const available = (stock?.quantity || 0) - (stock?.reservedQuantity || 0);

    if (!stock || available < quantity) {
      throw new AppError(
        `Insufficient available stock for variant ${variantId}`,
        400,
      );
    }

    const updated = await tx.stock.update({
      where: { id: stock.id },
      data: { reservedQuantity: { increment: quantity } },
    });

    await this._audit(
      tx,
      "STOCK_RESERVED",
      stock.id,
      {
        quantity: stock.quantity,
        reservedQuantity: stock.reservedQuantity,
        availableQuantity: available,
        referenceId,
      },
      {
        quantity: updated.quantity,
        reservedQuantity: updated.reservedQuantity,
        availableQuantity: updated.quantity - updated.reservedQuantity,
        referenceId,
      },
      userId,
    );

    return updated;
  }

  async releaseReservedStock(
    tx: PrismaTx,
    variantId: string,
    locationId: string,
    quantity: number,
    referenceId?: string,
    userId?: string,
  ) {
    const stock = await tx.stock.findUnique({
      where: {
        productVariantId_locationId: {
          productVariantId: variantId,
          locationId,
        },
      },
    });

    if (!stock || stock.reservedQuantity < quantity) {
      throw new AppError(
        `Insufficient reserved stock for variant ${variantId}`,
        400,
      );
    }

    const updated = await tx.stock.update({
      where: { id: stock.id },
      data: { reservedQuantity: { decrement: quantity } },
    });

    await this._audit(
      tx,
      "STOCK_RESERVATION_RELEASED",
      stock.id,
      {
        quantity: stock.quantity,
        reservedQuantity: stock.reservedQuantity,
        referenceId,
      },
      {
        quantity: updated.quantity,
        reservedQuantity: updated.reservedQuantity,
        referenceId,
      },
      userId,
    );

    return updated;
  }

  async fulfillReservedStock(
    tx: PrismaTx,
    variantId: string,
    locationId: string,
    quantity: number,
    type: MovementType,
    referenceId?: string,
    userId?: string,
  ) {
    const stock = await tx.stock.findUnique({
      where: {
        productVariantId_locationId: {
          productVariantId: variantId,
          locationId,
        },
      },
    });

    if (!stock || stock.quantity < quantity || stock.reservedQuantity < quantity) {
      throw new AppError(
        `Insufficient reserved stock for variant ${variantId}`,
        400,
      );
    }

    const updated = await tx.stock.update({
      where: { id: stock.id },
      data: {
        quantity: { decrement: quantity },
        reservedQuantity: { decrement: quantity },
      },
    });

    await tx.stockMovement.create({
      data: {
        stockId: stock.id,
        type,
        quantity: -quantity,
        referenceType: type,
        referenceId,
      },
    });

    await this._audit(
      tx,
      "STOCK_RESERVED_DECREASE",
      stock.id,
      {
        quantity: stock.quantity,
        reservedQuantity: stock.reservedQuantity,
        referenceId,
      },
      {
        quantity: updated.quantity,
        reservedQuantity: updated.reservedQuantity,
        referenceId,
      },
      userId,
    );

    return updated;
  }

  async decreaseStock(
    tx: PrismaTx,
    variantId: string,
    locationId: string,
    quantity: number,
    type: MovementType,
    referenceId?: string,
    userId?: string,
  ) {
    const stock = await tx.stock.findUnique({
      where: {
        productVariantId_locationId: {
          productVariantId: variantId,

          locationId,
        },
      },
    });
    const available = (stock?.quantity || 0) - (stock?.reservedQuantity || 0);

    if (!stock || available < quantity) {
      throw new AppError(
        `Insufficient available stock for variant ${variantId}`,
        400,
      );
    }
    const updated = await tx.stock.update({
      where: { id: stock.id },
      data: { quantity: { decrement: quantity } },
    });
    await tx.stockMovement.create({
      data: {
        stockId: stock.id,
        type,
        quantity: -quantity,
        referenceType: type,
        referenceId,
      },
    });
    await this._audit(
      tx,
      "STOCK_DECREASE",
      stock.id,
      { quantity: stock.quantity },
      { quantity: updated.quantity },
      userId,
    );
    return updated;
  }

  private async _audit(
    tx: PrismaTx,
    action: string,
    entityId: string,
    oldVal: any,
    newVal: any,
    userId?: string,
  ) {
    await tx.auditLog.create({
      data: {
        action,
        entity: "Stock",
        entityId,
        oldValue: oldVal,
        newValue: newVal,
        userId: userId || "system",
      },
    });
  }
}

export class InventoryStockService extends StockService {}
