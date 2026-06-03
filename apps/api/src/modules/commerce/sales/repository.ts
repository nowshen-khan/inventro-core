import { prisma } from "@/core/database/prisma";
import type { PaginationQuery } from "@repo/types/pagination";
import { getPagination } from "@/core/utils/pagination";
import type { CreateSaleInput } from "./schema";

interface SaleFilters extends PaginationQuery {
  branchId?: string;
}

export const saleRepository = {
  findAll: (filters?: SaleFilters) => {
    const { skip, take } = getPagination(filters?.page, filters?.limit);

    return prisma.sale.findMany({
      where: {
        deletedAt: null,

        ...(filters?.branchId && {
          branchId: filters.branchId,
        }),

        ...(filters?.search && {
          invoiceNo: {
            contains: filters.search,
            mode: "insensitive",
          },
        }),
      },

      include: {
        customer: true,
        branch: true,
        items: { include: { variant: { include: { product: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  findById: (id: string) =>
    prisma.sale.findFirstOrThrow({
      where: { id, deletedAt: null },
      include: {
        customer: true,
        branch: true,
        items: { include: { variant: { include: { product: true } } } },
      },
    }),
  create: (data: CreateSaleInput) =>
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
