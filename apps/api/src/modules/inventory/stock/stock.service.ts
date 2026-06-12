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
    const rows = await tx.$queryRaw<
      Array<{ id: string; quantity: number; reservedQuantity: number }>
    >`
      UPDATE "Stock"
      SET "reservedQuantity" = "reservedQuantity" + ${quantity}
      WHERE "productVariantId" = ${variantId}
        AND "locationId" = ${locationId}
        AND ("quantity" - "reservedQuantity") >= ${quantity}
      RETURNING "id", "quantity", "reservedQuantity"
    `;
    const stock = rows[0];

    if (!stock) {
      throw new AppError(
        `Insufficient available stock for variant ${variantId}`,
        400,
      );
    }

    await this._audit(
      tx,
      "STOCK_RESERVED",
      stock.id,
      {
        quantity: stock.quantity,
        reservedQuantity: stock.reservedQuantity,
        availableQuantity: stock.quantity - stock.reservedQuantity,
        referenceId,
      },
      {
        quantity: stock.quantity,
        reservedQuantity: stock.reservedQuantity,
        availableQuantity: stock.quantity - stock.reservedQuantity,
        referenceId,
      },
      userId,
    );

    return stock;
  }

  async releaseReservedStock(
    tx: PrismaTx,
    variantId: string,
    locationId: string,
    quantity: number,
    referenceId?: string,
    userId?: string,
  ) {
    const rows = await tx.$queryRaw<
      Array<{ id: string; quantity: number; reservedQuantity: number }>
    >`
      UPDATE "Stock"
      SET "reservedQuantity" = "reservedQuantity" - ${quantity}
      WHERE "productVariantId" = ${variantId}
        AND "locationId" = ${locationId}
        AND "reservedQuantity" >= ${quantity}
      RETURNING "id", "quantity", "reservedQuantity"
    `;
    const stock = rows[0];

    if (!stock) {
      throw new AppError(
        `Insufficient reserved stock for variant ${variantId}`,
        400,
      );
    }

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
        quantity: stock.quantity,
        reservedQuantity: stock.reservedQuantity,
        referenceId,
      },
      userId,
    );

    return stock;
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
    const rows = await tx.$queryRaw<
      Array<{ id: string; quantity: number; reservedQuantity: number }>
    >`
      UPDATE "Stock"
      SET "quantity" = "quantity" - ${quantity},
          "reservedQuantity" = "reservedQuantity" - ${quantity}
      WHERE "productVariantId" = ${variantId}
        AND "locationId" = ${locationId}
        AND "quantity" >= ${quantity}
        AND "reservedQuantity" >= ${quantity}
      RETURNING "id", "quantity", "reservedQuantity"
    `;
    const stock = rows[0];

    if (!stock) {
      throw new AppError(
        `Insufficient reserved stock for variant ${variantId}`,
        400,
      );
    }

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
        quantity: stock.quantity,
        reservedQuantity: stock.reservedQuantity,
        referenceId,
      },
      userId,
    );

    return stock;
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
    const rows = await tx.$queryRaw<
      Array<{ id: string; quantity: number; reservedQuantity: number }>
    >`
      UPDATE "Stock"
      SET "quantity" = "quantity" - ${quantity}
      WHERE "productVariantId" = ${variantId}
        AND "locationId" = ${locationId}
        AND ("quantity" - "reservedQuantity") >= ${quantity}
      RETURNING "id", "quantity", "reservedQuantity"
    `;
    const stock = rows[0];

    if (!stock) {
      throw new AppError(
        `Insufficient available stock for variant ${variantId}`,
        400,
      );
    }
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
      { quantity: stock.quantity, reservedQuantity: stock.reservedQuantity },
      { quantity: stock.quantity, reservedQuantity: stock.reservedQuantity },
      userId,
    );
    return stock;
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
