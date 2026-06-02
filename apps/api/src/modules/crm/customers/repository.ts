import { prisma } from "@/core/database/prisma";

export const customerRepository = {
  findAll: (filters = {}) =>
    prisma.customer.findMany({
      where: {
        deletedAt: null,
        ...filters,
      },
    }),

  findById: (id: string) =>
    prisma.customer.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    }),

  create: (data: any) =>
    prisma.customer.create({
      data,
    }),

  update: (id: string, data: any) =>
    prisma.customer.update({
      where: { id },
      data,
    }),

  softDelete: (id: string) =>
    prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    }),
};
