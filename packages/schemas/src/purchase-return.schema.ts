import { z } from "zod";

export const purchaseReturnItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  costPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

export const createPurchaseReturnSchema = z.object({
  purchaseId: z.string().uuid(),
  supplierId: z.string().uuid(),
  branchId: z.string().uuid(),
  note: z.string().trim().optional(),
  items: z.array(purchaseReturnItemSchema),
});
