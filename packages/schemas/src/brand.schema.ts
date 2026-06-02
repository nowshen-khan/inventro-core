import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().trim().min(1),

  description: z.string().trim().optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>;

export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
