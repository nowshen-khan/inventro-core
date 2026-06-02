import { prisma } from "@/core/database/prisma";

export const authRepository = {
  findUserByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email }, include: { role: true } }),

  findUserById: (id: string) =>
    prisma.user.findUnique({ where: { id }, include: { role: true } }),

  updateRefreshToken: (id: string, refreshToken: string | null) =>
    prisma.user.update({ where: { id }, data: { refreshToken } }),
};
