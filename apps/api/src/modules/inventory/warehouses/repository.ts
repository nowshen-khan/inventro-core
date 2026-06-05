import { prisma } from "@/core/database/prisma";
import type { UpdateWarehouseInput, CreateWarehouseInput } from "./schema";
import type { WarehouseFilters } from "@repo/types/warehouse";

export const warehouseRepository = {
  findAll: async (filters: WarehouseFilters) => {
    const page = Number(filters?.page) || 1;
    const limit = Number(filters?.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,

      ...(filters?.branchId && {
        branchId: filters.branchId,
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
      prisma.warehouse.findMany({
        where,
        include: { branch: true },
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),

      prisma.warehouse.count({
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
    prisma.warehouse.findFirstOrThrow({
      where: { id, deletedAt: null },
      include: { branch: true },
    }),

  create: (data: CreateWarehouseInput) => prisma.warehouse.create({ data }),

  update: (id: string, data: UpdateWarehouseInput) =>
    prisma.warehouse.update({ where: { id }, data }),

  softDelete: async (id: string) => {
    const warehouse = await prisma.warehouse.findUniqueOrThrow({
      where: { id },
    });

    return prisma.warehouse.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        code: `${warehouse.code}_deleted_${Date.now()}`,
      },
    });
  },
};
