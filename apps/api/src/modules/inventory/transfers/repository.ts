import { prisma } from "@/core/database/prisma";
import { Prisma, TransferStatus } from "@prisma/client";

export type TransferFilters = {
  search?: string;
  status?: TransferStatus;
  sourceLocationId?: string;
  destLocationId?: string;
  dateFrom?: string;
  dateTo?: string;
};

const transferInclude = {
  sourceLocation: true,
  destLocation: true,
  items: { include: { variant: { include: { product: true } } } },
} satisfies Prisma.TransferInclude;

const endOfDay = (date: string) => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

const buildWhere = (filters?: TransferFilters): Prisma.TransferWhereInput => ({
  deletedAt: null,
  ...(filters?.status && { status: filters.status }),
  ...(filters?.sourceLocationId && {
    sourceLocationId: filters.sourceLocationId,
  }),
  ...(filters?.destLocationId && { destLocationId: filters.destLocationId }),
  ...((filters?.dateFrom || filters?.dateTo) && {
    createdAt: {
      ...(filters.dateFrom && { gte: new Date(filters.dateFrom) }),
      ...(filters.dateTo && { lte: endOfDay(filters.dateTo) }),
    },
  }),
  ...(filters?.search && {
    OR: [
      { transferNo: { contains: filters.search, mode: "insensitive" } },
      { note: { contains: filters.search, mode: "insensitive" } },
      {
        sourceLocation: {
          name: { contains: filters.search, mode: "insensitive" },
        },
      },
      {
        destLocation: {
          name: { contains: filters.search, mode: "insensitive" },
        },
      },
    ],
  }),
});

export const transferRepository = {
  findAll: (filters?: TransferFilters) =>
    prisma.transfer.findMany({
      where: buildWhere(filters),
      include: transferInclude,
      orderBy: { createdAt: "desc" },
    }),
  findById: (id: string) =>
    prisma.transfer.findFirstOrThrow({
      where: { id, deletedAt: null },
      include: transferInclude,
    }),
  create: (data: any) =>
    prisma.transfer.create({
      data: {
        transferNo: data.transferNo,
        sourceLocationId: data.sourceLocationId,
        destLocationId: data.destLocationId,
        status: data.status ?? "PENDING",
        note: data.note,
        requestedBy: data.requestedBy,
        items: { create: data.items },
      },
      include: transferInclude,
    }),
  updateStatus: (id: string, status: TransferStatus, approvedBy?: string) =>
    prisma.transfer.update({ where: { id }, data: { status, approvedBy } }),
  auditLogs: (id: string) =>
    prisma.auditLog.findMany({
      where: { entity: "Transfer", entityId: id },
      orderBy: { createdAt: "desc" },
    }),
  buildWhere,
};
