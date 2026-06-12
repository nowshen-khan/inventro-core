import { productRepository } from "./repository";
import { AppError } from "@/core/errors/AppError";
import { prisma } from "@/core/database/prisma";
import XLSX from "xlsx";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@repo/schemas/product";

export class ProductService {
  async getAll(filters?: any, page?: 1, limit?: 10) {
    return productRepository.findAll(filters, page, limit);
  }

  async getById(id: string) {
    return productRepository.findById(id);
  }

  async create(data: CreateProductInput, userId?: string) {
    return prisma.$transaction(async (tx) => {
      const product = await productRepository.create(tx, {
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
            color: v.color,
            size: v.size,
            gender: v.gender,
            costPrice: v.costPrice,
            sellingPrice: v.sellingPrice,
            mrp: v.mrp,
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

      await this.audit(
        tx,
        "PRODUCT_CREATED",
        product.id,
        null,
        {
          name: product.name,
          styleCode: product.styleCode,
          variants: product.variants.length,
        },
        userId,
      );

      return product;
    });
  }
  async update(id: string, data: UpdateProductInput, userId?: string) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    return prisma.$transaction(async (tx) => {
      const before = await tx.product.findUniqueOrThrow({
        where: { id },
        include: {
          category: true,
          brand: true,
          supplier: true,
          variants: true,
          images: true,
        },
      });

      const updated = await productRepository.update(tx, id, data);

      await this.audit(
        tx,
        "PRODUCT_UPDATED",
        id,
        {
          name: before.name,
          styleCode: before.styleCode,
          variants: before.variants.length,
        },
        {
          name: updated?.name,
          styleCode: updated?.styleCode,
          variants: updated?.variants?.length,
        },
        userId,
      );

      return updated;
    });
  }
  async delete(id: string, userId?: string) {
    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        variants: true,
        images: true,
      },
    });

    const result = await productRepository.softDelete(id);

    if (product) {
      await prisma.auditLog.create({
        data: {
          action: "PRODUCT_DELETED",
          entity: "Product",
          entityId: product.id,
          oldValue: {
            name: product.name,
            styleCode: product.styleCode,
            variants: product.variants.length,
          },
          newValue: {
            deletedAt: new Date().toISOString(),
          },
          userId: userId || "system",
        },
      });
    }

    return result;
  }
  async findByBarcode(barcode: string) {
    const variant = await productRepository.findByBarcode(barcode);
    if (!variant) throw new AppError("Product not found", 404);
    return variant;
  }

  async importProducts(file: any, userId?: string) {
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

      const product = await prisma.product.upsert({
        where: { styleCode: row.STYLE_CODE },
        update: {
          name: row.PRODUCT_NAME,
          categoryId: category.id,
          brandId: brand?.id ?? null,
          supplierId: supplier?.id ?? null,
        },
        create: {
          styleCode: row.STYLE_CODE,
          name: row.PRODUCT_NAME,
          categoryId: category.id,
          brandId: brand?.id ?? null,
          supplierId: supplier?.id ?? null,
        },
      });

      const variant = await prisma.productVariant.upsert({
        where: { sku: row.SKU },
        update: {
          productId: product.id,
          barcode: row.BARCODE || null,
          color: row.COLOR || null,
          size: row.SIZE || null,
          gender: row.GENDER || null,
          costPrice: row.COST_PRICE,
          sellingPrice: row.SELLING_PRICE,
          mrp: row.MRP || row.SELLING_PRICE,
          reorderLevel: Number(row.REORDER_LEVEL) || 10,
          deletedAt: null,
        },
        create: {
          productId: product.id,
          sku: row.SKU,
          barcode: row.BARCODE || null,
          color: row.COLOR || null,
          size: row.SIZE || null,
          gender: row.GENDER || null,
          costPrice: row.COST_PRICE,
          sellingPrice: row.SELLING_PRICE,
          mrp: row.MRP || row.SELLING_PRICE,
          reorderLevel: Number(row.REORDER_LEVEL) || 10,
        },
      });

      const location = await prisma.location.findFirst();

      if (location) {
        await prisma.stock.upsert({
          where: {
            productVariantId_locationId: {
              productVariantId: variant.id,
              locationId: location.id,
            },
          },
          update: {
            quantity: Number(row.STOCK) || 0,
          },
          create: {
            productVariantId: variant.id,
            locationId: location.id,
            quantity: Number(row.STOCK) || 0,
          },
        });
      }

      await prisma.auditLog.create({
        data: {
          action: "PRODUCT_IMPORTED",
          entity: "Product",
          entityId: product.id,
          oldValue: null,
          newValue: {
            styleCode: product.styleCode,
            sku: variant.sku,
            barcode: variant.barcode,
            mrp: variant.mrp,
          },
          userId: userId || "system",
        },
      });
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

          MRP: variant.mrp,

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

  async getAuditLogs(id: string) {
    return prisma.auditLog.findMany({
      where: { entity: "Product", entityId: id },
      orderBy: { createdAt: "desc" },
    });
  }

  private async audit(
    tx: any,
    action: string,
    entityId: string,
    oldValue: any,
    newValue: any,
    userId?: string,
  ) {
    await tx.auditLog.create({
      data: {
        action,
        entity: "Product",
        entityId,
        oldValue,
        newValue,
        userId: userId || "system",
      },
    });
  }
}
