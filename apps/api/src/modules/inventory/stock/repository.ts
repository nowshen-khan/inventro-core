import { prisma } from "@/core/database/prisma";

export const stockRepository = {
  findAllStock: (filters?: any) => {
    const where: any = {};
    if (filters?.locationId) where.locationId = filters.locationId;
    if (filters?.variantId) where.productVariantId = filters.variantId;
    if (filters?.productId) where.variant = { productId: filters.productId };
    // if (filters?.lowStock === "true")
    //   where.quantity = { lte: prisma.productVariant.fields.reorderLevel };
    return prisma.stock.findMany({
      where,
      include: {
        variant: { include: { product: true } },
        location: true,
      },
    }).then((stocks) =>
      stocks.map((stock) => ({
        ...stock,
        availableQuantity: stock.quantity - stock.reservedQuantity,
      })),
    );
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
