import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1),

  email: z.string().email().trim().optional(),

  phone: z.string().trim().optional(),

  address: z.string().trim().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
