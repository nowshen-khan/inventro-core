import { seedPermissions } from "./seeds/permissions.seed";
import { seedRoles } from "./seeds/roles.seed";
import { seedSuperAdmin } from "./seeds/super-admin.seed";
import { seedBranch } from "./seeds/branch.seed";
import { seedProduct } from "./seeds/product.seed";

async function main() {
  console.log("🌱 Seeding started...");
  await seedPermissions();
  await seedRoles();
  await seedSuperAdmin();
  await seedBranch();
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
