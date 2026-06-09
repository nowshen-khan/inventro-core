import { seedPermissions } from "./seeds/permissions.seed";
import { seedRoles } from "./seeds/roles.seed";
import { seedSuperAdmin } from "./seeds/super-admin.seed";
import { seedProduct } from "./seeds/product.seed";
import { seedLocations } from "./seeds/location.seed";

async function main() {
  console.log("🌱 Seeding started...");
  await seedPermissions();
  await seedRoles();
  await seedSuperAdmin();
  await seedLocations();

  await seedProduct();
}

main()
  .then(() => {
    console.log("🎉 Database seeding completed");
  })
  .catch((error) => {
    console.error("❌ Seed failed:");

    console.error(error);

    process.exit(1);
  });
