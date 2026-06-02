import { z } from "zod";

export const saleReturnItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  sellingPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

export const createSaleReturnSchema = z.object({
  saleId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
  branchId: z.string().uuid(),
  refundAmount: z.number().min(0).optional(),
  note: z.string().optional(),
  items: z.array(saleReturnItemSchema).min(1),
});
