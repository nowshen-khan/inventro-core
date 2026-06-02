import { prisma } from "@/core/database/prisma";

export const posProductRepository = {
  searchProducts: async (search?: string) => {
    return prisma.productVariant.findMany({
      where: {
        deletedAt: null,

        product: {
          deletedAt: null,

          OR: [
            {
              name: {
                contains: search,

                mode: "insensitive",
              },
            },

            {
              styleCode: {
                contains: search,

                mode: "insensitive",
              },
            },
          ],
        },
      },

      include: {
        product: true,

        stocks: true,
      },

      take: 20,
    });
  },
};
