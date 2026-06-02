import { z } from "zod";

export const createWarehouseSchema = z.object({
  name: z.string().trim().min(1),
  code: z.string().trim().min(1),
  branchId: z.string().uuid(),
});

export const updateWarehouseSchema = createWarehouseSchema.partial();
