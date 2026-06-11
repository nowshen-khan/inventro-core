import { prisma } from "@/core/database/prisma";

export const purchaseRepository = {
  findAll: (filters?: any) => {
    const page = Number(filters?.page) || 1;
    const limit = Number(filters?.limit) || 10;
    const skip = (page - 1) * limit;
    return prisma.purchase.findMany({
      where: { deletedAt: null },
      include: {
        supplier: true,

        items: { include: { variant: { include: { product: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });
  },
  findById: (id: string) =>
    prisma.purchase.findFirstOrThrow({
      where: { id, deletedAt: null },
      include: {
        supplier: true,

        items: { include: { variant: { include: { product: true } } } },
      },
    }),
  create: (data: any) =>
    prisma.purchase.create({
      data: {
        invoiceNo: data.invoiceNo,
        supplierId: data.supplierId,

        totalAmount: data.items.reduce(
          (s: number, i: any) => s + i.totalPrice,
          0,
        ),
        paidAmount: data.paidAmount || 0,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        items: { create: data.items },
      },
      include: { items: true },
    }),
  softDelete: (id: string) =>
    prisma.purchase.update({ where: { id }, data: { deletedAt: new Date() } }),
};
