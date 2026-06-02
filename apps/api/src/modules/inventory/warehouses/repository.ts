import { prisma } from "@/core/database/prisma";

export const warehouseRepository = {
  findAll: (filters: any) =>
    prisma.warehouse.findMany({
      where: { deletedAt: null, ...filters },
      include: { branch: true },
    }),
  findById: (id: string) =>
    prisma.warehouse.findFirstOrThrow({
      where: { id, deletedAt: null },
      include: { branch: true },
    }),
  create: (data: any) => prisma.warehouse.create({ data }),
  update: (id: string, data: any) =>
    prisma.warehouse.update({ where: { id }, data }),
  softDelete: (id: string) =>
    prisma.warehouse.update({ where: { id }, data: { deletedAt: new Date() } }),
};
