import { prisma } from "@/core/database/prisma";

export const categoryRepository = {
  findAll: (filters = {}) =>
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        deletedAt: null,
        ...filters,
      },
    }),

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
    prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    }),
};
