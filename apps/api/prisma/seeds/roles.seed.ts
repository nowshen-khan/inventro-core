import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRoles() {
  const superAdminPermissions = await prisma.permission.findMany();

  await prisma.role.upsert({
    where: {
      name: "SUPER_ADMIN",
    },

    update: {},

    create: {
      name: "SUPER_ADMIN",

      permissions: {
        create: superAdminPermissions.map((permission) => ({
          permission: {
            connect: {
              id: permission.id,
            },
          },
        })),
      },
    },
  });

  console.log("✅ Roles seeded");
}
