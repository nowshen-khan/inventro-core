import { prisma } from "@/core/database/prisma";

export const productInclude = {
  category: true,

  brand: true,

  supplier: true,

  variants: {
    where: {
      deletedAt: null,
    },

    include: {
      stocks: true,
    },
  },

  images: true,
};

export const productRepository = {
  async findAll(filters: any = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    // Global search
    if (filters.search) {
      where.OR = [
        {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },

        {
          styleCode: {
            contains: filters.search,
            mode: "insensitive",
          },
        },

        {
          variants: {
            some: {
              sku: {
                contains: filters.search,
                mode: "insensitive",
              },
            },
          },
        },

        {
          variants: {
            some: {
              barcode: {
                contains: filters.search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    // Category filter
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,

        include: productInclude,

        skip,

        take: limit,

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.product.count({
        where,
      }),
    ]);

    return {
      items,

      meta: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    };
  },

  findById(id: string) {
    return prisma.product.findFirstOrThrow({
      where: {
        id,

        deletedAt: null,
      },

      include: productInclude,
    });
  },

  create(tx: typeof prisma, data: any) {
    return tx.product.create({
      data,

      include: productInclude,
    });
  },

  update(id: string, data: any) {
    return prisma.$transaction(async (tx) => {
      // update product
      await tx.product.update({
        where: { id },

        data: {
          name: data.name,

          styleCode: data.styleCode,

          description: data.description,

          categoryId: data.categoryId,

          brandId: data.brandId,

          supplierId: data.supplierId,
        },
      });

      // remove variants
      await tx.productVariant.deleteMany({
        where: {
          productId: id,
        },
      });

      // recreate variants
      await tx.productVariant.createMany({
        data: data.variants.map((v: any) => ({
          productId: id,

          sku: v.sku,

          barcode: v.barcode,

          color: v.color,

          size: v.size,

          gender: v.gender,

          costPrice: v.costPrice,

          sellingPrice: v.sellingPrice,

          reorderLevel: v.reorderLevel ?? 10,
        })),
      });

      // replace images
      await tx.productImage.deleteMany({
        where: {
          productId: id,
        },
      });

      if (data.imageUrls?.length) {
        await tx.productImage.createMany({
          data: data.imageUrls.map((url: string) => ({
            productId: id,

            url,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id },

        include: {
          category: true,

          brand: true,

          supplier: true,

          variants: {
            include: {
              stocks: true,
            },
          },

          images: true,
        },
      });
    });
  },

  softDelete(id: string) {
    return prisma.product.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  },

  findByBarcode(barcode: string) {
    return prisma.productVariant.findFirst({
      where: {
        barcode,

        deletedAt: null,
      },

      include: {
        product: {
          include: {
            images: true,

            category: true,

            brand: true,
          },
        },

        stocks: true,
      },
    });
  },

  findVariantBySku(sku: string) {
    return prisma.productVariant.findFirst({
      where: {
        sku,

        deletedAt: null,
      },

      include: {
        product: true,

        stocks: true,
      },
    });
  },

  posSearch: (search?: string) =>
    prisma.productVariant.findMany({
      where: {
        deletedAt: null,

        ...(search
          ? {
              OR: [
                {
                  sku: {
                    contains: search,
                    mode: "insensitive",
                  },
                },

                {
                  barcode: {
                    contains: search,
                    mode: "insensitive",
                  },
                },

                {
                  product: {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },

                {
                  product: {
                    styleCode: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),
      },

      include: {
        product: true,
        stocks: true,
      },

      take: 20,
    }),
};
