import { z } from "zod";

export const exchangeItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  sellingPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

export const createProductExchangeSchema = z.object({
  originalSaleId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
  branchId: z.string().uuid(),
  warehouseId: z.string().uuid(),

  /*
      old returned items
    */
  returnItems: z.array(exchangeItemSchema).min(1),

  /*
      new selling items
    */
  newItems: z.array(exchangeItemSchema).min(1),
  exchangeAmount: z.number().optional(),
  refundAmount: z.number().optional(),
  note: z.string().optional(),
});
