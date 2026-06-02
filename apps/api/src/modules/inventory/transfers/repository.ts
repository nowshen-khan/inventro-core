import { prisma } from "@/core/database/prisma";

export const transferRepository = {
  findAll: (filters?: any) =>
    prisma.transfer.findMany({
      where: { ...filters },
      include: {
        sourceWarehouse: { include: { branch: true } },
        destWarehouse: { include: { branch: true } },
        items: { include: { variant: { include: { product: true } } } },
      },
    }),
  findById: (id: string) =>
    prisma.transfer.findFirstOrThrow({
      where: { id },
      include: {
        sourceWarehouse: { include: { branch: true } },
        destWarehouse: { include: { branch: true } },
        items: { include: { variant: { include: { product: true } } } },
      },
    }),
  create: (data: any) =>
    prisma.transfer.create({
      data: {
        transferNo: data.transferNo,
        sourceWarehouseId: data.sourceWarehouseId,
        destWarehouseId: data.destWarehouseId,
        items: { create: data.items },
      },
      include: { items: true },
    }),
  updateStatus: (id: string, status: TransferStatus, approvedBy?: string) =>
    prisma.transfer.update({ where: { id }, data: { status, approvedBy } }),
};
