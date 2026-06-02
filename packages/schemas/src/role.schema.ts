import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "WAREHOUSE_MANAGER",
    "CASHIER",
    "STAFF",
  ]),
  permissions: z.array(z.string()).optional(),
});
