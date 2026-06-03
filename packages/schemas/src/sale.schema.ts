import { z } from "zod";

export const saleItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  sellingPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

export const createSaleSchema = z.object({
  invoiceNo: z.string().trim().min(1),
  branchId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
  items: z.array(saleItemSchema).min(1),
  subtotal: z.number(),
  tax: z.number().optional(),
  discount: z.number().optional(),
  totalAmount: z.number(),
  paidAmount: z.number(),
  paymentMethod: z
    .enum(["CASH", "CARD", "BANK_TRANSFER", "MOBILE_BANKING"])
    .optional(),
});

export type SaleItemInput = z.infer<typeof saleItemSchema>;

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
