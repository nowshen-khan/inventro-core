import { prisma } from "@/core/database/prisma";

export const branchRepository = {
  findAll: async (filters?: any) => {
    return prisma.branch.findMany({
      where: { deletedAt: null, ...filters },
      include: { warehouses: true },
    });
  },
  findById: async (id: string) => {
    return prisma.branch.findFirstOrThrow({
      where: { id, deletedAt: null },
      include: { warehouses: true },
    });
  },
  create: async (data: any) => {
    return prisma.branch.create({ data });
  },
  update: async (id: string, data: any) => {
    return prisma.branch.update({ where: { id }, data });
  },
  softDelete: async (id: string) => {
    return prisma.branch.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
