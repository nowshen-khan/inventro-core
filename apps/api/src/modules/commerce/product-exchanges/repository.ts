import { prisma } from "@/core/database/prisma";

export const productExchangeRepository = {
  findAll: () =>
    prisma.productExchange.findMany({
      include: {
        originalSale: true,
        saleReturn: true,
        newSale: true,
        customer: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

  findById: (id: string) =>
    prisma.productExchange.findFirstOrThrow({
      where: {
        id,
      },

      include: {
        originalSale: {
          include: {
            items: true,
          },
        },

        saleReturn: {
          include: {
            items: true,
          },
        },

        newSale: {
          include: {
            items: true,
          },
        },

        customer: true,
      },
    }),
};
