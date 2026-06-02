import { saleRepository } from "./repository";
import { InventoryStockService } from "@/modules/inventory/stock/stock.service";
import { prisma } from "@/core/database/prisma";

export class SaleService {
  constructor(private inventoryService: InventoryStockService) {}

  async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const subtotal = data.items.reduce(
        (sum: number, item: any) =>
          sum + Number(item.quantity) * Number(item.sellingPrice),
        0,
      );

      const tax = Number(data.tax || 0);

      const discount = Number(data.discount || 0);

      const totalAmount = subtotal + tax - discount;

      const invoiceNo = data.invoiceNo || `SALE-${Date.now()}`;

      if (Number(data.paidAmount) > totalAmount) {
        throw new Error("Paid amount cannot exceed total");
      }
      const sale = await tx.sale.create({
        data: {
          invoiceNo,
          branchId: data.branchId,
          customerId: data.customerId,
          subtotal,
          tax,
          discount,
          totalAmount,
          paidAmount: data.paidAmount,
          paymentMethod: data.paymentMethod,
          items: { create: data.items },
        },
      });
      // Decrease stock for each item
      for (const item of data.items) {
        await this.inventoryService.decreaseStock(
          tx,
          item.productVariantId,
          data.branchId,
          data.warehouseId, // the POS is tied to a warehouse
          item.quantity,
          "SALE",
          sale.id,
          userId,
        );
      }
      return sale;
    });
  }
  async getAll(filters?: any) {
    return saleRepository.findAll(filters);
  }
  async getById(id: string) {
    return saleRepository.findById(id);
  }
}
