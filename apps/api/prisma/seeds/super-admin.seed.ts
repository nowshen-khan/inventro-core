import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seedSuperAdmin() {
  const role = await prisma.role.findUniqueOrThrow({
    where: {
      name: "SUPER_ADMIN",
    },
  });

  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@erp.com",
    },

    update: {},

    create: {
      name: "Super Admin",

      email: "admin@erp.com",

      password,

      roleId: role.id,
    },
  });

  console.log("✅ Super admin seeded");
}
