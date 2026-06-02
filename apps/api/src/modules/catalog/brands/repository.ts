import { prisma } from "@/core/database/prisma";

export const brandRepository = {
  findAll: (filters = {}) =>
    prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        deletedAt: null,
        ...filters,
      },
    }),

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
