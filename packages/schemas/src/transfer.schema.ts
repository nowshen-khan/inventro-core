import { z } from "zod";

export const transferStatusSchema = z.enum([
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
]);

export const transferItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const createTransferSchema = z.object({
  transferNo: z.string().trim().min(1).optional(),
  sourceLocationId: z.string().uuid(),
  destLocationId: z.string().uuid(),
  status: z.enum(["DRAFT", "PENDING"]).default("PENDING").optional(),
  note: z.string().trim().max(500).optional(),
  items: z.array(transferItemSchema).min(1),
});
