import { productRepository } from "./repository";
import { AppError } from "@/core/errors/AppError";
import { prisma } from "@/core/database/prisma";
import XLSX from "xlsx";

type VariantInput = {
  sku: string;
  barcode?: string;
  attributes?: any;
  costPrice: number;
  sellingPrice: number;
  reorderLevel?: number;
};

type CreateProductInput = {
  name: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  supplierId?: string;
  imageUrls?: string[];
  variants: VariantInput[];
  styleCode: string;
};

export class ProductService {
  async getAll(filters?: any, page?: 1, limit?: 10) {
    return productRepository.findAll(filters, page, limit);
  }

  async getById(id: string) {
    return productRepository.findById(id);
  }

  async create(data: CreateProductInput) {
    return prisma.$transaction(async (tx) => {
      return productRepository.create(tx, {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        brandId: data.brandId,
        supplierId: data.supplierId,
        styleCode: data.styleCode,

        variants: {
          create: data.variants.map((v) => ({
            sku: v.sku,
            barcode: v.barcode,
            attributes: v.attributes,
            costPrice: v.costPrice,
            sellingPrice: v.sellingPrice,
            reorderLevel: v.reorderLevel ?? 10,
          })),
        },
        images: data.imageUrls?.length
          ? {
              create: data.imageUrls.map((url) => ({
                url,
              })),
            }
          : undefined,
      });
    });
  }
  async update(id: string, data: any) {
    if (!data.name) {
      throw new Error("Product name is required");
    }

    if (!data.variants?.length) {
      throw new Error("At least one variant required");
    }

    // business logic

    const existingProduct = await productRepository.findById(id);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // repository call

    return productRepository.updateWithRelations(id, data);
  }
  async delete(id: string) {
    return productRepository.softDelete(id);
  }
  async findByBarcode(barcode: string) {
    const variant = await productRepository.findByBarcode(barcode);
    if (!variant) throw new AppError("Product not found", 404);
    return variant;
  }

  async importProducts(file: any) {
    const buffer = await file.toBuffer();

    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

    for (const row of rows as any[]) {
      const category = await prisma.category.upsert({
        where: { name: row.CATEGORY },
        update: {},
        create: { name: row.CATEGORY },
      });

      const brand = row.BRAND
        ? await prisma.brand.upsert({
            where: { name: row.BRAND },
            update: {},
            create: { name: row.BRAND },
          })
        : null;

      const supplier = row.SUPPLIER
        ? await prisma.supplier.upsert({
            where: { email: `${row.SUPPLIER}@import.com` },
            update: {},
            create: { name: row.SUPPLIER, email: `${row.SUPPLIER}@import.com` },
          })
        : null;

      let product = await prisma.product.findFirst({
        where: { styleCode: row.STYLE_CODE },
      });
      if (!product) {
        product = await prisma.product.create({
          data: {
            styleCode: row.STYLE_CODE,
            name: row.PRODUCT_NAME,
            categoryId: category.id,
            brandId: brand?.id,
            supplierId: supplier?.id,
          },
        });
      }

      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: row.SKU,
          barcode: row.BARCODE,
          color: row.COLOR,
          size: row.SIZE,
          gender: row.GENDER,

          costPrice: row.COST_PRICE,
          sellingPrice: row.SELLING_PRICE,
        },
      });

      const location = await prisma.location.findFirst();

      if (location) {
        await prisma.stock.create({
          data: {
            productVariantId: variant.id,
            locationId: location.id,
            quantity: Number(row.STOCK) || 0,
          },
        });
      }
    }

    return {
      message: "Import completed",
    };
  }

  async exportProducts(filters?: any) {
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,

        ...(filters?.search && {
          OR: [
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
          ],
        }),

        ...(filters?.categoryId && {
          categoryId: filters.categoryId,
        }),

        ...(filters?.brandId && {
          brandId: filters.brandId,
        }),
      },

      include: {
        category: true,

        brand: true,

        supplier: true,

        variants: {
          include: {
            stocks: true,
          },
        },
      },
    });

    const rows: any[] = [];

    for (const product of products) {
      for (const variant of product.variants) {
        rows.push({
          STYLE_CODE: product.styleCode,

          PRODUCT_NAME: product.name,

          CATEGORY: product.category?.name,

          BRAND: product.brand?.name,

          SUPPLIER: product.supplier?.name,

          COLOR: variant.color,

          SIZE: variant.size,

          GENDER: variant.gender,

          SKU: variant.sku,

          BARCODE: variant.barcode,

          STOCK: variant.stocks.reduce((acc, stock) => acc + stock.quantity, 0),
        });
      }
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    return XLSX.write(workbook, {
      type: "buffer",

      bookType: "xlsx",
    });
  }

  async posSearch(search?: string) {
    return productRepository.posSearch(search);
  }
}
