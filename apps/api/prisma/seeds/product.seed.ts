import { PrismaClient, Gender } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedProduct() {
  const category = await prisma.category.upsert({
    where: {
      name: "Mens Corduroy Pant",
    },

    update: {},

    create: {
      name: "Mens Corduroy Pant",
    },
  });

  const brand = await prisma.brand.upsert({
    where: {
      name: "Nike",
    },

    update: {},

    create: {
      name: "Nike",
    },
  });

  const supplier = await prisma.supplier.upsert({
    where: {
      email: "supplier@erp.com",
    },

    update: {},

    create: {
      name: "Default Supplier",
      email: "supplier@erp.com",
      phone: "01700000000",
      address: "Dhaka",
    },
  });

  const existing = await prisma.product.findUnique({
    where: {
      styleCode: "01-2016-RRQ1001",
    },

    include: {
      variants: true,
    },
  });

  let product = existing;

  if (!product) {
    product = await prisma.product.create({
      data: {
        name: "Mens Corduroy Pant",

        styleCode: "01-2016-RRQ1001",

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
              gender: Gender.MALE,
              costPrice: 1000,
              sellingPrice: 1495,
            },
          ],
        },
      },

      include: {
        variants: true,
      },
    });
  }

  const location = await prisma.location.findFirstOrThrow({
    where: {
      code: "MAIN-WH",
    },
  });

  for (const variant of product.variants) {
    await prisma.stock.upsert({
      where: {
        productVariantId_locationId: {
          productVariantId: variant.id,
          locationId: location.id,
        },
      },

      update: {},

      create: {
        productVariantId: variant.id,
        locationId: location.id,
        quantity: 50,
      },
    });
  }

  console.log("✅ Product seeded");
}
