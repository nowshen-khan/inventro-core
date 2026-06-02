import { prisma } from "@/core/database/prisma";

export const userRepository = {
  findAll: (filters?: any) =>
    prisma.user.findMany({
      where: { deletedAt: null, ...filters },
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        branchId: true,
        role: true,
        branch: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  findById: (id: string) =>
    prisma.user.findFirstOrThrow({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        branchId: true,
        role: true,
        branch: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  create: (data: any) =>
    prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        branchId: true,
        role: true,
        branch: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  update: (id: string, data: any) =>
    prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        branchId: true,
        role: true,
        branch: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  softDelete: (id: string) =>
    prisma.user.update({ where: { id }, data: { deletedAt: new Date() } }),
};
