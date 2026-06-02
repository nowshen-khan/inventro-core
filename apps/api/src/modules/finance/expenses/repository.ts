import { prisma } from "@/core/database/prisma";

export const expenseRepository = {
  findAll: (filters?: any) =>
    prisma.expense.findMany({
      where: { ...filters },
      include: { branch: true },
    }),
  findById: (id: string) =>
    prisma.expense.findFirstOrThrow({
      where: { id },
      include: { branch: true },
    }),
  create: (data: any) =>
    prisma.expense.create({ data, include: { branch: true } }),
  update: (id: string, data: any) =>
    prisma.expense.update({ where: { id }, data, include: { branch: true } }),
  delete: (id: string) => prisma.expense.delete({ where: { id } }),
};
