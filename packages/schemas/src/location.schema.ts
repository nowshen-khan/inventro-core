import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string().trim().min(1),
  code: z.string().trim().min(1),
  type: z.enum(["WAREHOUSE", "OUTLET", "TRANSIT"]),
  address: z.string().optional(),
});

export const updateLocationSchema = createLocationSchema.partial();

export type CreateLocationInput = z.infer<typeof createLocationSchema>;

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
