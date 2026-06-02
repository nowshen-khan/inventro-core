import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();
