import "dotenv/config";

import { PrismaClient, RoleName } from "@prisma/client";

import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  /*
  =========================
  PERMISSIONS
  =========================
  */

  const superAdminPerms = [
    "branch:view",
    "branch:create",
    "branch:update",
    "branch:delete",

    "warehouse:view",
    "warehouse:create",
    "warehouse:update",
    "warehouse:delete",

    "product:view",
    "product:create",
    "product:update",
    "product:delete",

    "category:view",
    "category:create",
    "category:update",
    "category:delete",

    "brand:view",
    "brand:create",
    "brand:update",
    "brand:delete",

    "supplier:view",
    "supplier:create",
    "supplier:update",
    "supplier:delete",

    "customer:view",
    "customer:create",
    "customer:update",
    "customer:delete",

    "purchase:view",
    "purchase:create",
    "purchase:update",
    "purchase:delete",

    "sale:view",
    "sale:create",
    "sale:update",
    "sale:delete",

    "transfer:view",
    "transfer:create",
    "transfer:approve",

    "inventory:view",

    "expense:view",
    "expense:create",
    "expense:update",
    "expense:delete",

    "user:view",
    "user:create",
    "user:update",
    "user:delete",

    "role:view",
    "role:create",
    "role:update",
    "role:delete",

    "report:view",

    "dashboard:view",
  ];

  const adminPerms = superAdminPerms.filter(
    (p) => !p.startsWith("role:") && !p.startsWith("user:delete"),
  );

  const managerPerms = [
    "branch:view",

    "warehouse:view",

    "product:view",

    "category:view",

    "brand:view",

    "supplier:view",

    "customer:view",

    "purchase:view",

    "sale:view",

    "transfer:view",

    "inventory:view",

    "expense:view",

    "user:view",

    "report:view",

    "dashboard:view",
  ];

  const warehouseManagerPerms = [
    "warehouse:view",

    "inventory:view",

    "transfer:view",

    "transfer:create",

    "transfer:approve",

    "product:view",

    "dashboard:view",
  ];

  const cashierPerms = [
    "sale:view",

    "sale:create",

    "customer:view",

    "customer:create",

    "dashboard:view",
  ];

  const staffPerms = ["dashboard:view"];

  /*
  =========================
  ROLES
  =========================
  */

  const roles = await Promise.all([
    prisma.role.upsert({
      where: {
        name: RoleName.SUPER_ADMIN,
      },

      update: {},

      create: {
        name: RoleName.SUPER_ADMIN,

        permissions: {
          create: superAdminPerms.map((action) => ({
            action,
          })),
        },
      },
    }),

    prisma.role.upsert({
      where: {
        name: RoleName.ADMIN,
      },

      update: {},

      create: {
        name: RoleName.ADMIN,

        permissions: {
          create: adminPerms.map((action) => ({
            action,
          })),
        },
      },
    }),

    prisma.role.upsert({
      where: {
        name: RoleName.MANAGER,
      },

      update: {},

      create: {
        name: RoleName.MANAGER,

        permissions: {
          create: managerPerms.map((action) => ({
            action,
          })),
        },
      },
    }),

    prisma.role.upsert({
      where: {
        name: RoleName.WAREHOUSE_MANAGER,
      },

      update: {},

      create: {
        name: RoleName.WAREHOUSE_MANAGER,

        permissions: {
          create: warehouseManagerPerms.map((action) => ({
            action,
          })),
        },
      },
    }),

    prisma.role.upsert({
      where: {
        name: RoleName.CASHIER,
      },

      update: {},

      create: {
        name: RoleName.CASHIER,

        permissions: {
          create: cashierPerms.map((action) => ({
            action,
          })),
        },
      },
    }),

    prisma.role.upsert({
      where: {
        name: RoleName.STAFF,
      },

      update: {},

      create: {
        name: RoleName.STAFF,

        permissions: {
          create: staffPerms.map((action) => ({
            action,
          })),
        },
      },
    }),
  ]);

  /*
  =========================
  ADMIN USER
  =========================
  */

  const password = await hashPassword("admin123");

  await prisma.user.upsert({
    where: {
      email: "admin@erp.com",
    },

    update: {},

    create: {
      email: "admin@erp.com",

      password,

      name: "Super Admin",

      roleId: roles[0].id,
    },
  });

  /*
  =========================
  BRANCH
  =========================
  */

  const branch = await prisma.branch.upsert({
    where: {
      code: "MAIN",
    },

    update: {},

    create: {
      name: "Main Branch",

      code: "MAIN",

      address: "Head Office",
    },
  });

  /*
  =========================
  WAREHOUSE
  =========================
  */

  const warehouse = await prisma.warehouse.upsert({
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

  /*
  =========================
  CATEGORY
  =========================
  */

  const category = await prisma.category.upsert({
    where: {
      name: "Mens Corduroy Pant",
    },

    update: {},

    create: {
      name: "Mens Corduroy Pant",
    },
  });

  /*
  =========================
  BRAND
  =========================
  */

  const brand = await prisma.brand.upsert({
    where: {
      name: "Nike",
    },

    update: {},

    create: {
      name: "Nike",
    },
  });

  /*
  =========================
  SUPPLIER
  =========================
  */

  const supplier = await prisma.supplier.upsert({
    where: {
      email: "supplier@erp.com",
    },

    update: {},

    create: {
      name: "Default Supplier",

      email: "supplier@erp.com",

      phone: "01700000000",

      address: "Dhaka, Bangladesh",
    },
  });

  /*
  =========================
  PRODUCT
  =========================
  */

  // const product = await prisma.product.create({
  //   data: {
  //     name: "Mens Corduroy Pant",

  //     styleCode: "01-2016-R RQ1001",

  //     description: "Premium corduroy pant",

  //     categoryId: category.id,

  //     brandId: brand.id,

  //     supplierId: supplier.id,

  //     variants: {
  //       create: [
  //         {
  //           sku: "SKU-001",

  //           barcode: "A000350",

  //           color: "Black",

  //           size: "30X30",

  //           gender: "MALE",

  //           costPrice: 1000,

  //           sellingPrice: 1495,

  //           reorderLevel: 10,
  //         },

  //         {
  //           sku: "SKU-002",

  //           barcode: "A000363",

  //           color: "Black",

  //           size: "34X32",

  //           gender: "MALE",

  //           costPrice: 1000,

  //           sellingPrice: 1495,

  //           reorderLevel: 10,
  //         },

  //         {
  //           sku: "SKU-003",

  //           barcode: "A000349",

  //           color: "Blue",

  //           size: "30X30",

  //           gender: "MALE",

  //           costPrice: 1000,

  //           sellingPrice: 1495,

  //           reorderLevel: 10,
  //         },
  //       ],
  //     },
  //   },

  //   include: {
  //     variants: true,
  //   },
  // });
  const existingProduct = await prisma.product.findUnique({
    where: {
      styleCode: "01-2016-R RQ1001",
    },
  });

  let product;

  if (existingProduct) {
    product = await prisma.product.findUnique({
      where: {
        id: existingProduct.id,
      },

      include: {
        variants: true,
      },
    });
  } else {
    product = await prisma.product.create({
      data: {
        name: "Mens Corduroy Pant",

        styleCode: "01-2016-R RQ1001",

        description: "Premium corduroy pant",

        categoryId: category.id,

        brandId: brand.id,

        supplierId: supplier.id,

        variants: {
          create: [
            {
              sku: "SKU-001",

              barcode: "A000350",

              color: "Black",

              size: "30X30",

              gender: "MALE",

              costPrice: 1000,

              sellingPrice: 1495,

              reorderLevel: 10,
            },

            {
              sku: "SKU-002",

              barcode: "A000363",

              color: "Black",

              size: "34X32",

              gender: "MALE",

              costPrice: 1000,

              sellingPrice: 1495,

              reorderLevel: 10,
            },

            {
              sku: "SKU-003",

              barcode: "A000349",

              color: "Blue",

              size: "30X30",

              gender: "MALE",

              costPrice: 1000,

              sellingPrice: 1495,

              reorderLevel: 10,
            },
          ],
        },
      },

      include: {
        variants: true,
      },
    });
  }
  /*
  =========================
  STOCK
  =========================
  */

  await prisma.stock.createMany({
    data: product.variants.map((variant) => ({
      productVariantId: variant.id,

      warehouseId: warehouse.id,
      branchId: branch.id,
      quantity: 50,
    })),
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
