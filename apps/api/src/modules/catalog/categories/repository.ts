import { prisma } from "@/core/database/prisma";
import type { CategoryFilters } from "@repo/types/common";

export const categoryRepository = {
  findAll: async (filters?: CategoryFilters) => {
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
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),

      prisma.category.count({
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
    prisma.category.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    }),

  create: (data: any) =>
    prisma.category.create({
      data,
    }),

  update: (id: string, data: any) =>
    prisma.category.update({
      where: { id },
      data,
    }),

  softDelete: (id: string) =>
    prisma.category
      .findUniqueOrThrow({
        where: { id },
      })
      .then((category) =>
        prisma.category.update({
          where: { id },
          data: {
            deletedAt: new Date(),
            name: `${category.name}_deleted_${Date.now()}`,
          },
        }),
      ),
};
