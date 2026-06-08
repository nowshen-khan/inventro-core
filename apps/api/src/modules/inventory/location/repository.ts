import { prisma } from "@/core/database/prisma";
import type { UpdateLocationInput, CreateLocationInput } from "./schema";
import type { LocationFilters } from "@repo/types/location";

export const locationRepository = {
  findAll: async (filters: LocationFilters) => {
    const page = Number(filters?.page) || 1;
    const limit = Number(filters?.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,

      ...(filters?.type && {
        type: filters.type,
      }),

      ...(filters?.search && {
        OR: [
          {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.location.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),

      prisma.location.count({
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
    prisma.location.findFirstOrThrow({
      where: { id, deletedAt: null },
    }),

  create: (data: CreateLocationInput) => prisma.location.create({ data }),

  update: (id: string, data: UpdateLocationInput) =>
    prisma.location.update({ where: { id }, data }),

  softDelete: async (id: string) => {
    const location = await prisma.location.findUniqueOrThrow({
      where: { id },
    });

    return prisma.location.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        code: `${location.code}_deleted_${Date.now()}`,
      },
    });
  },
};
