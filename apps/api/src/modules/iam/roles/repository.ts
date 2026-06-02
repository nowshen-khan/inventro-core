import { prisma } from "@/core/database/prisma";

export const roleRepository = {
  findAll: (filters?: any) =>
    prisma.role.findMany({
      where: { ...filters },
      include: { permissions: true },
    }),
  findById: (id: string) =>
    prisma.role.findFirstOrThrow({
      where: { id },
      include: { permissions: true },
    }),
  create: (data: any) =>
    prisma.role.create({
      data: {
        name: data.name,
        permissions: data.permissions
          ? { create: data.permissions.map((p: string) => ({ action: p })) }
          : undefined,
      },
      include: { permissions: true },
    }),
  update: (id: string, data: any) =>
    prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        permissions: data.permissions
          ? {
              deleteMany: {},
              create: data.permissions.map((p: string) => ({ action: p })),
            }
          : undefined,
      },
      include: { permissions: true },
    }),
  delete: (id: string) => prisma.role.delete({ where: { id } }),
};
