import { prisma } from "@/core/database/prisma";

import { InventoryStockService } from "@/modules/inventory/stock/stock.service.js";
import { MovementType } from "@repo/types/enums";
import { AppError } from "@/core/errors/AppError";
import { purchaseReturnRepository } from "./repository.js";

export class PurchaseReturnService {
  constructor(private inventoryService: InventoryStockService) {}

  async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findFirst({
        where: {
          id: data.purchaseId,

          deletedAt: null,
        },

        include: {
          items: true,
        },
      });

      if (!purchase) {
        throw new AppError("Purchase not found", 404);
      }

      /*
         validate return quantity
        */

      for (const item of data.items) {
        const purchaseItem = purchase.items.find(
          (pi) => pi.productVariantId === item.productVariantId,
        );

        if (!purchaseItem) {
          throw new AppError("Variant not found in purchase", 400);
        }

        if (item.quantity > purchaseItem.quantity) {
          throw new AppError("Return quantity exceeds purchased quantity", 400);
        }
      }

      /*
          create return
        */

      const purchaseReturn = await tx.purchaseReturn.create({
        data: {
          returnNo: `PR-${Date.now()}`,

          purchaseId: data.purchaseId,

          supplierId: data.supplierId,

          branchId: data.branchId,

          note: data.note,

          totalAmount: data.items.reduce(
            (sum: number, item: any) => sum + item.totalPrice,
            0,
          ),

          items: {
            create: data.items,
          },
        },

        include: {
          items: true,
        },
      });

      /*
          decrease stock
        */

      for (const item of data.items) {
        const stock = await tx.stock.findFirst({
          where: {
            productVariantId: item.productVariantId,

            branchId: data.branchId,
          },
        });

        if (!stock) {
          throw new AppError("Stock not found", 404);
        }

        await this.inventoryService.decreaseStock(
          tx,
          item.productVariantId,
          data.branchId,
          stock.warehouseId,
          item.quantity,
          MovementType.PURCHASE,
          purchaseReturn.id,
          userId,
        );
      }

      return purchaseReturn;
    });
  }

  async getAll() {
    return purchaseReturnRepository.findAll();
  }

  async getById(id: string) {
    return purchaseReturnRepository.findById(id);
  }

  async delete(id: string) {
    return purchaseReturnRepository.softDelete(id);
  }
}
