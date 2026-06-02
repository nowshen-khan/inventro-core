import { z } from "zod";

export const transferItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const createTransferSchema = z.object({
  transferNo: z.string().trim().min(1),
  sourceWarehouseId: z.string().uuid(),
  destWarehouseId: z.string().uuid(),
  items: z.array(transferItemSchema).min(1),
});
