import { prisma } from "@/core/database/prisma";
import { InventoryStockService } from "@/modules/inventory/stock/stock.service";
import { MovementType } from "@repo/types/enums";
import { productExchangeRepository } from "./repository";

export class ProductExchangeService {
  constructor(private inventoryService: InventoryStockService) {}

  async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      /*
          exchange number
        */

      const exchangeNo = `EX-${Date.now()}`;

      /*
          calculate totals
        */

      const returnTotal = data.returnItems.reduce(
        (sum: number, item: any) => sum + Number(item.totalPrice),
        0,
      );

      const newSaleTotal = data.newItems.reduce(
        (sum: number, item: any) => sum + Number(item.totalPrice),
        0,
      );

      /*
          create return
        */

      const saleReturn = await tx.saleReturn.create({
        data: {
          returnNo: `SR-${Date.now()}`,
          saleId: data.originalSaleId,
          customerId: data.customerId,
          branchId: data.branchId,
          totalAmount: returnTotal,
          refundAmount: data.refundAmount || 0,
          note: data.note,
          items: {
            create: data.returnItems,
          },
        },

        include: {
          items: true,
        },
      });

      /*
          restore stock
        */

      for (const item of data.returnItems) {
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

      /*
          create new sale
        */

      const newSale = await tx.sale.create({
        data: {
          invoiceNo: `EXSALE-${Date.now()}`,

          branchId: data.branchId,

          customerId: data.customerId,

          subtotal: newSaleTotal,

          totalAmount: newSaleTotal,

          paidAmount: data.exchangeAmount || 0,

          paymentMethod: "CASH",

          items: {
            create: data.newItems,
          },
        },

        include: {
          items: true,
        },
      });

      /*
          deduct stock
        */

      for (const item of data.newItems) {
        await this.inventoryService.decreaseStock(
          tx,

          item.productVariantId,

          data.branchId,

          data.warehouseId,

          item.quantity,

          MovementType.SALE,

          newSale.id,

          userId,
        );
      }

      /*
          create exchange
        */

      const exchange = await tx.productExchange.create({
        data: {
          exchangeNo,

          originalSaleId: data.originalSaleId,

          saleReturnId: saleReturn.id,

          newSaleId: newSale.id,

          customerId: data.customerId,

          branchId: data.branchId,

          exchangeAmount: data.exchangeAmount || 0,

          refundAmount: data.refundAmount || 0,

          note: data.note,
        },
      });

      return exchange;
    });
  }

  async getAll() {
    return productExchangeRepository.findAll();
  }

  async getById(id: string) {
    return productExchangeRepository.findById(id);
  }
}
