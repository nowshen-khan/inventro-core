import { z } from "zod";

export const stockAdjustmentItemSchema = z.object({
  productVariantId: z.string().uuid(),
  systemQuantity: z.number().int(),
  physicalQuantity: z.number().int(),
});

export const createStockAdjustmentSchema = z.object({
  adjustmentNo: z.string().min(1),
  locationId: z.string().uuid(),
  note: z.string().optional(),
  items: z.array(stockAdjustmentItemSchema).min(1),
});
