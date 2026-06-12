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

    if (filters.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters.supplierId) {
      where.supplierId = filters.supplierId;
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

  update(txOrId: any, maybeId?: any, maybeData?: any) {
    const hasTx = typeof txOrId === "object" && typeof maybeId === "string";
    const client = hasTx ? txOrId : prisma;
    const id = hasTx ? maybeId : txOrId;
    const data = hasTx ? maybeData : maybeId;

    const run = async () => {
      await client.product.update({
        where: { id },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.styleCode !== undefined ? { styleCode: data.styleCode } : {}),
          ...(data.description !== undefined
            ? { description: data.description }
            : {}),
          ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
          ...(data.brandId !== undefined
            ? { brandId: data.brandId || null }
            : {}),
          ...(data.supplierId !== undefined
            ? { supplierId: data.supplierId || null }
            : {}),
        },
      });

      if (Array.isArray(data.variants)) {
        const existingVariants = await client.productVariant.findMany({
          where: {
            productId: id,
            deletedAt: null,
          },
        });

        const existingBySku = new Map(existingVariants.map((v) => [v.sku, v]));
        const incomingSkus = new Set<string>();

        for (const variant of data.variants) {
          incomingSkus.add(variant.sku);
          const existing = existingBySku.get(variant.sku);

          if (existing) {
            await client.productVariant.update({
              where: { id: existing.id },
              data: {
                barcode: variant.barcode || null,
                color: variant.color || null,
                size: variant.size || null,
                gender: variant.gender || null,
                costPrice: variant.costPrice,
                sellingPrice: variant.sellingPrice,
                mrp: variant.mrp,
                reorderLevel: variant.reorderLevel ?? 10,
                deletedAt: null,
              },
            });
          } else {
            await client.productVariant.create({
              data: {
                productId: id,
                sku: variant.sku,
                barcode: variant.barcode || null,
                color: variant.color || null,
                size: variant.size || null,
                gender: variant.gender || null,
                costPrice: variant.costPrice,
                sellingPrice: variant.sellingPrice,
                mrp: variant.mrp,
                reorderLevel: variant.reorderLevel ?? 10,
              },
            });
          }
        }

        const removedVariants = existingVariants.filter(
          (variant) => !incomingSkus.has(variant.sku),
        );

        for (const variant of removedVariants) {
          await client.productVariant.update({
            where: { id: variant.id },
            data: {
              sku: `${variant.sku}_deleted_${Date.now()}`,
              barcode: variant.barcode
                ? `${variant.barcode}_deleted_${Date.now()}`
                : null,
              deletedAt: new Date(),
            },
          });
        }
      }

      if (data.imageUrls !== undefined) {
        await client.productImage.deleteMany({
          where: {
            productId: id,
          },
        });

        if (data.imageUrls.length) {
          await client.productImage.createMany({
            data: data.imageUrls.map((url: string) => ({
              productId: id,
              url,
            })),
          });
        }
      }

      return client.product.findUnique({
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
    };

    return hasTx ? run() : prisma.$transaction(run);
  },

  softDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUniqueOrThrow({
        where: { id },
        include: {
          variants: true,
        },
      });

      await tx.productVariant.updateMany({
        where: {
          productId: id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      for (const variant of product.variants) {
        await tx.productVariant.update({
          where: { id: variant.id },
          data: {
            sku: `${variant.sku}_deleted_${Date.now()}`,
            barcode: variant.barcode ? `${variant.barcode}_deleted_${Date.now()}` : null,
            deletedAt: new Date(),
          },
        });
      }

      await tx.productImage.updateMany({
        where: {
          productId: id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return tx.product.update({
        where: {
          id,
        },

        data: {
          deletedAt: new Date(),
          styleCode: `${product.styleCode}_deleted_${Date.now()}`,
        },
      });
    };

    if (hasTx) {
      return run(tx);
    }

    return prisma.$transaction(async (tx) => run(tx));
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
