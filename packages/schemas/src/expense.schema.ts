import { z } from "zod";

export const createExpenseSchema = z.object({
  description: z.string().trim().min(1),
  amount: z.number().positive(),
  locationId: z.string().uuid().optional(),
  date: z.string().datetime().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
