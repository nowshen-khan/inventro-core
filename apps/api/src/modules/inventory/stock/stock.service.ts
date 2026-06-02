import { Prisma, PrismaClient } from "@prisma/client";
import { AppError } from "@/core/errors/AppError";
import { MovementType } from "@repo/types/enums";

type PrismaTx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export class InventoryStockService {
  async increaseStock(
    tx: PrismaTx,
    variantId: string,
    warehouseId: string,
    quantity: number,
    type: MovementType,
    referenceId?: string,
    userId?: string,
  ) {
    const stock = await tx.stock.upsert({
      where: {
        productVariantId_warehouseId: {
          productVariantId: variantId,
          warehouseId,
        },
      },
      create: { productVariantId: variantId, warehouseId, quantity },
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

  async decreaseStock(
    tx: PrismaTx,
    variantId: string,
    warehouseId: string,
    quantity: number,
    type: MovementType,
    referenceId?: string,
    userId?: string,
  ) {
    const stock = await tx.stock.findUnique({
      where: {
        productVariantId_warehouseId: {
          productVariantId: variantId,

          warehouseId,
        },
      },
    });
    if (!stock || stock.quantity < quantity) {
      throw new AppError(`Insufficient stock for variant ${variantId}`, 400);
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
