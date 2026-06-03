import { prisma } from "@/core/database/prisma";
import type { CreateRoleInput, UpdateRoleInput } from "./schema";
import type { RoleFilters } from "@repo/types/rbac";

export const roleRepository = {
  findAll: async (filters?: RoleFilters) => {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(filters?.search && {
        name: {
          contains: filters.search,
          mode: "insensitive",
        },
      }),
    };

    const [items, total] = await Promise.all([
      prisma.role.findMany({
        where,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.role.count({
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
    prisma.role.findFirstOrThrow({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    }),
  create: (data: CreateRoleInput) =>
    prisma.role.create({
      data: {
        name: data.name,
        permissions: data.permissions
          ? {
              create: data.permissions.map((action: string) => ({
                permission: { connect: { action } },
              })),
            }
          : undefined,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    }),
  update: (id: string, data: UpdateRoleInput) =>
    prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        permissions: data.permissions
          ? {
              deleteMany: {},
              create: data.permissions.map((action: string) => ({
                permission: {
                  connect: { action },
                },
              })),
            }
          : undefined,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    }),
  softDelete: (id: string) =>
    prisma.role.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    }),
};
