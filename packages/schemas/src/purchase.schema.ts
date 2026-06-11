import { z } from "zod";

export const purchaseItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  costPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

export const createPurchaseSchema = z.object({
  invoiceNo: z.string().trim().min(1),
  supplierId: z.string().trim().uuid(),
  locationId: z.string().trim().uuid(),
  items: z.array(purchaseItemSchema).min(1),
  paidAmount: z.number().optional(),
  dueDate: z.string().datetime().optional(),
});
