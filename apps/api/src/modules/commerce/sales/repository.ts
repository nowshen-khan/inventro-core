import { prisma } from "@/core/database/prisma";

export const saleRepository = {
  findAll: (filters?: any) =>
    prisma.sale.findMany({
      where: { deletedAt: null, ...filters },
      include: {
        customer: true,
        branch: true,
        items: { include: { variant: { include: { product: true } } } },
      },
    }),
  findById: (id: string) =>
    prisma.sale.findFirstOrThrow({
      where: { id },
      include: {
        customer: true,
        branch: true,
        items: { include: { variant: { include: { product: true } } } },
      },
    }),
  create: (data: any) =>
    prisma.sale.create({
      data: {
        invoiceNo: data.invoiceNo,
        branchId: data.branchId,
        customerId: data.customerId,
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
        paymentMethod: data.paymentMethod,
        items: { create: data.items },
      },
      include: { items: true },
    }),
};
