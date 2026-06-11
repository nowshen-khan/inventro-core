import { prisma } from "@/core/database/prisma";

export const purchaseReturnRepository = {
  findAll: () =>
    prisma.purchaseReturn.findMany({
      where: {
        deletedAt: null,
      },

      include: {
        supplier: true,

        purchase: true,

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
    prisma.purchaseReturn.findFirstOrThrow({
      where: {
        id,

        deletedAt: null,
      },

      include: {
        supplier: true,

        purchase: true,

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

  softDelete: (id: string) =>
    prisma.purchaseReturn.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    }),
};
