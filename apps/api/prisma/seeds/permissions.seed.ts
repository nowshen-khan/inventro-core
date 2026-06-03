import { PrismaClient } from "@prisma/client";
import { ALL_PERMISSIONS } from "@repo/permissions";

const prisma = new PrismaClient();

export async function seedPermissions() {
  for (const action of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { action },

      update: {},

      create: {
        action,
      },
    });
  }

  console.log("✅ Permissions seeded");
}
