import { prisma } from "@/core/database/prisma";
import { InventoryStockService } from "@/modules/inventory/stock/stock.service";
import { purchaseRepository } from "./repository";

export class PurchaseService {
  constructor(private inventoryService: InventoryStockService) {}

  async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      // Create purchase with items
      const purchase = await tx.purchase.create({
        data: {
          invoiceNo:
            data.invoiceNo?.trim() ||
            `PUR-${new Date().getFullYear()}-${Math.floor(
              1000 + Math.random() * 9000,
            )}`,
          supplierId: data.supplierId,

          totalAmount: data.items.reduce(
            (sum: number, item: any) => sum + item.totalPrice,
            0,
          ),
          paidAmount: data.paidAmount || 0,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          items: { create: data.items },
        },
        include: { items: true },
      });
      // Increase stock for each item
      for (const item of data.items) {
        // determine location (in this case, a default receiving location)
        await this.inventoryService.increaseStock(
          tx,
          item.productVariantId,
          data.locationId, // assuming single location per purchase // passed from request
          item.quantity,
          "PURCHASE",
          purchase.id,
          userId,
        );
      }
      return purchase;
    });
  }
  async getAll(filters?: any) {
    return purchaseRepository.findAll(filters);
  }
  async getById(id: string) {
    return purchaseRepository.findById(id);
  }
  async delete(id: string) {
    return purchaseRepository.softDelete(id);
  }
}
