import { prisma } from "@/core/database/prisma";

export const supplierRepository = {
  findAll: () =>
    prisma.supplier.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { name: "asc" },
    }),

  findById: (id: string) =>
    prisma.supplier.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    }),

  create: (data: any) =>
    prisma.supplier.create({
      data,
    }),

  update: (id: string, data: any) =>
    prisma.supplier.update({
      where: { id },
      data,
    }),

  softDelete: async (id: string) => {
    const supplier = await prisma.supplier.findUniqueOrThrow({
      where: { id },
    });

    return prisma.supplier.update({
      where: { id },

      data: {
        deletedAt: new Date(),

        email: supplier.email
          ? `${supplier.email}_deleted_${Date.now()}`
          : null,
      },
    });
  },
};
