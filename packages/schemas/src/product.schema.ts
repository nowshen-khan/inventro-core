import { z } from "zod";

export const variantSchema = z.object({
  sku: z.string().trim().min(1),
  barcode: z.string().trim().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNISEX", "BOYS", "GIRLS", "KIDS"]),
  costPrice: z.number(),
  sellingPrice: z.number(),
  reorderLevel: z.number().int().default(10),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1),
  styleCode: z.string().min(1),
  description: z.string().trim().optional(),
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  variants: z.array(variantSchema).min(1),
  imageUrls: z.array(z.string().trim()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
