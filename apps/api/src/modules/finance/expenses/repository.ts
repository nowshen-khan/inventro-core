import { prisma } from "@/core/database/prisma";

export const expenseRepository = {
  findAll: (filters?: any) =>
    prisma.expense.findMany({
      where: { ...filters },
      include: { location: true },
    }),

  findById: (id: string) =>
    prisma.expense.findFirstOrThrow({
      where: { id },
      include: { location: true },
    }),

  create: (data: any) =>
    prisma.expense.create({ data, include: { location: true } }),

  update: (id: string, data: any) =>
    prisma.expense.update({ where: { id }, data, include: { location: true } }),

  delete: (id: string) => prisma.expense.delete({ where: { id } }),
};
