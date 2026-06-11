import { z } from "zod";

export const stockQuerySchema = z.object({
  locationId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  variantId: z.string().uuid().optional(),
  lowStock: z.boolean().optional(),
});

export type StockQueryInput = z.infer<typeof stockQuerySchema>;
