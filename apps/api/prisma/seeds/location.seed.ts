import { PrismaClient, LocationType } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedLocations() {
  await prisma.location.upsert({
    where: {
      code: "MAIN-WH",
    },
    update: {},
    create: {
      name: "Main Warehouse",
      code: "MAIN-WH",
      type: LocationType.WAREHOUSE,
      address: "Tejgaon, Dhaka",
    },
  });

  console.log("✅ Locations seeded");
}
