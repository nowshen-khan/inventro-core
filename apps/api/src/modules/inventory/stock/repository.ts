import { prisma } from "@/core/database/prisma";

export const inventoryRepository = {
  findAllStock: (filters?: any) => {
    const where: any = {};
    if (filters?.branchId) where.branchId = filters.branchId;
    if (filters?.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters?.variantId) where.productVariantId = filters.variantId;
    if (filters?.productId) where.variant = { productId: filters.productId };
    // if (filters?.lowStock === "true")
    //   where.quantity = { lte: prisma.productVariant.fields.reorderLevel };
    return prisma.stock.findMany({
      where,
      include: {
        variant: { include: { product: true } },
        warehouse: true,
        branch: true,
      },
    });
  },
  findMovements: (stockId?: string) =>
    prisma.stockMovement.findMany({
      where: stockId ? { stockId } : {},
      include: {
        stock: { include: { variant: { include: { product: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
};
