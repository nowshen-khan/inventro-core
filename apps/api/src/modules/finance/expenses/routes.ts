import { FastifyInstance } from "fastify";
import { ExpenseController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createExpenseSchema, updateExpenseSchema } from "./schema";

export async function expenseRoutes(app: FastifyInstance) {
  const ctrl = new ExpenseController();
  app.addHook("onRequest", app.authenticate);
  app.get("/", { preHandler: authorize("expense:view") }, ctrl.getAll);
  app.get("/:id", { preHandler: authorize("expense:view") }, ctrl.getById);
  app.post(
    "/",
    {
      preHandler: [authorize("expense:create"), validate(createExpenseSchema)],
    },
    ctrl.create,
  );
  app.put(
    "/:id",
    {
      preHandler: [authorize("expense:update"), validate(updateExpenseSchema)],
    },
    ctrl.update,
  );
  app.delete("/:id", { preHandler: authorize("expense:delete") }, ctrl.delete);
}
