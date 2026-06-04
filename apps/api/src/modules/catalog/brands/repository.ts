import { prisma } from "@/core/database/prisma";
import { BrandFilters } from "@repo/types/common";

export const brandRepository = {
  findAll: async (filters?: BrandFilters) => {
    const page = Number(filters?.page) || 1;
    const limit = Number(filters?.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,

      ...(filters?.search && {
        name: {
          contains: filters.search,
          mode: "insensitive",
        },
      }),
    };

    const [items, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),

      prisma.brand.count({
        where,
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  findById: (id: string) =>
    prisma.brand.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    }),

  create: (data: any) =>
    prisma.brand.create({
      data,
    }),

  update: (id: string, data: any) =>
    prisma.brand.update({
      where: { id },
      data,
    }),

  softDelete: async (id: string) => {
    return prisma.brand.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
