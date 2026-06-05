import { prisma } from "@/core/database/prisma";
import { SupplierFilters } from "@repo/types/supplier";

export const supplierRepository = {
  findAll: async (filters?: SupplierFilters) => {
    const page = Number(filters?.page) || 1;
    const limit = Number(filters?.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,

      ...(filters?.search && {
        OR: [
          {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: filters.search,
            },
          },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),

      prisma.supplier.count({
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
    prisma.supplier.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    }),

  create: (data: any) =>
    prisma.supplier.create({
      data,
    }),

  update: (id: string, data: any) =>
    prisma.supplier.update({
      where: { id },
      data,
    }),

  softDelete: async (id: string) => {
    const supplier = await prisma.supplier.findUniqueOrThrow({
      where: { id },
    });

    return prisma.supplier.update({
      where: { id },

      data: {
        deletedAt: new Date(),

        email: supplier.email
          ? `${supplier.email}_deleted_${Date.now()}`
          : null,
        phone: supplier.phone
          ? `${supplier.phone}_deleted_${Date.now()}`
          : null,
      },
    });
  },
};
