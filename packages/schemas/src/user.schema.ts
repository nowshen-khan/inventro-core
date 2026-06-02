import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
  name: z.string().trim().min(1),
  roleId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
});

export const updateUserSchema = createUserSchema
  .partial()
  .omit({
    password: true,
  })
  .extend({
    password: z.string().min(6).optional(),
  });
