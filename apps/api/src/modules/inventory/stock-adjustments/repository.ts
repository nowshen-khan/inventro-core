import { prisma } from "@/core/database/prisma";

export const stockAdjustmentRepository = {
  findAll: () =>
    prisma.stockAdjustment.findMany({
      include: {
        warehouse: true,

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
    prisma.stockAdjustment.findFirstOrThrow({
      where: {
        id,
      },

      include: {
        warehouse: true,

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
