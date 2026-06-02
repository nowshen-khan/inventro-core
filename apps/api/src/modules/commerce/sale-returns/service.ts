import { prisma } from "@/core/database/prisma";

import { MovementType } from "@repo/types/enums";

import { InventoryStockService } from "@/modules/inventory/stock/stock.service";

import { saleReturnRepository } from "./repository";

export class SaleReturnService {
  constructor(private inventoryService: InventoryStockService) {}

  async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const returnNo = `SR-${Date.now()}`;

      const totalAmount = data.items.reduce(
        (sum: number, item: any) => sum + Number(item.totalPrice),
        0,
      );

      const saleReturn = await tx.saleReturn.create({
        data: {
          returnNo,

          saleId: data.saleId,

          customerId: data.customerId,

          branchId: data.branchId,

          refundAmount: data.refundAmount || 0,

          note: data.note,

          totalAmount,

          items: {
            create: data.items,
          },
        },

        include: {
          items: true,
        },
      });

      /*
          restore stock
        */

      for (const item of data.items) {
        await this.inventoryService.increaseStock(
          tx,

          item.productVariantId,

          data.branchId,

          data.warehouseId,

          item.quantity,

          MovementType.RETURN,

          saleReturn.id,

          userId,
        );
      }

      return saleReturn;
    });
  }

  async getAll() {
    return saleReturnRepository.findAll();
  }

  async getById(id: string) {
    return saleReturnRepository.findById(id);
  }
}
