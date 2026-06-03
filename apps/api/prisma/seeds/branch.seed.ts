import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedBranch() {
  const branch = await prisma.branch.upsert({
    where: {
      code: "MAIN",
    },

    update: {},

    create: {
      name: "Main Branch",
      code: "MAIN",
      address: "Dhaka",
      phone: "01700000000",
    },
  });

  await prisma.warehouse.upsert({
    where: {
      code: "MAIN-WH",
    },

    update: {},

    create: {
      name: "Main Warehouse",
      code: "MAIN-WH",
      branchId: branch.id,
    },
  });

  console.log("✅ Branch seeded");
}
