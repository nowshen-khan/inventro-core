import { prisma } from "@/core/database/prisma";
import type { CustomerFilters } from "@repo/types/common";
import { CreateCustomerInput, UpdateCustomerInput } from "./schema";

export const customerRepository = {
  findAll: async (filters?: CustomerFilters) => {
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
          {
            email: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
      }),

      prisma.customer.count({
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
    prisma.customer.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    }),

  create: (data: CreateCustomerInput) =>
    prisma.customer.create({
      data,
    }),

  update: (id: string, data: UpdateCustomerInput) =>
    prisma.customer.update({
      where: { id },
      data,
    }),

  softDelete: async (id: string) => {
    const customer = await prisma.customer.findUniqueOrThrow({
      where: { id },
    });

    return prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        email: customer.email
          ? `${customer.email}_deleted_${Date.now()}`
          : null,
        phone: customer.phone
          ? `${customer.phone}_deleted_${Date.now()}`
          : null,
      },
    });
  },
};
