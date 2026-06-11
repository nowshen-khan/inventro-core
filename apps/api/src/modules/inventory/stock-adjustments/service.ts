import { prisma } from "@/core/database/prisma";

import { InventoryStockService } from "../stock/stock.service";
import { MovementType } from "@repo/types/enums";
import { stockAdjustmentRepository as repo } from "./repository";

export class StockAdjustmentService {
  private inventory = new InventoryStockService();

  async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      // CREATE ADJUSTMENT

      const adjustment = await tx.stockAdjustment.create({
        data: {
          adjustmentNo: data.adjustmentNo,

          locationId: data.locationId,

          note: data.note,

          createdBy: userId,

          items: {
            create: data.items.map((item: any) => ({
              productVariantId: item.productVariantId,

              systemQuantity: item.systemQuantity,

              physicalQuantity: item.physicalQuantity,

              difference: item.physicalQuantity - item.systemQuantity,
            })),
          },
        },

        include: {
          items: true,
        },
      });

      // STOCK MOVEMENTS

      for (const item of adjustment.items) {
        const diff = item.difference;

        // STOCK INCREASE

        if (diff > 0) {
          await this.inventory.increaseStock(
            tx,
            item.productVariantId,
            data.locationId,
            diff,
            MovementType.ADJUSTMENT,
            adjustment.id,
            userId,
          );
        }

        // STOCK DECREASE

        if (diff < 0) {
          await this.inventory.decreaseStock(
            tx,
            item.productVariantId,
            data.locationId,
            Math.abs(diff),
            MovementType.ADJUSTMENT,
            adjustment.id,
            userId,
          );
        }
      }

      return adjustment;
    });
  }

  async getAll() {
    return repo.findAll();
  }

  async getById(id: string) {
    return repo.findById(id);
  }
}
