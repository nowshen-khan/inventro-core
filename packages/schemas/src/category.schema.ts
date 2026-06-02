import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1),

  description: z.string().trim().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
