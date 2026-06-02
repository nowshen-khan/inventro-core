import { prisma } from "@/core/database/prisma";

export const saleReturnRepository = {
  findAll: () =>
    prisma.saleReturn.findMany({
      include: {
        sale: true,

        customer: true,

        branch: true,

        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

  findById: (id: string) =>
    prisma.saleReturn.findFirstOrThrow({
      where: {
        id,
      },

      include: {
        sale: true,

        customer: true,

        branch: true,

        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    }),
};
