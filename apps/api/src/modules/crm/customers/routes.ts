import { FastifyInstance } from "fastify";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createCustomerSchema, updateCustomerSchema } from "./schema";
import { CustomerController } from "./controller";

export async function customerRoutes(app: FastifyInstance) {
  const ctrl = new CustomerController();

  app.addHook("onRequest", app.authenticate);

  app.get(
    "/",
    {
      preHandler: authorize("customer:view"),
    },
    ctrl.getAll,
  );

  app.get(
    "/:id",
    {
      preHandler: authorize("customer:view"),
    },
    ctrl.getById,
  );

  app.post(
    "/",
    {
      preHandler: [
        authorize("customer:create"),
        validate(createCustomerSchema),
      ],
    },
    ctrl.create,
  );

  app.put(
    "/:id",
    {
      preHandler: [
        authorize("customer:update"),
        validate(updateCustomerSchema),
      ],
    },
    ctrl.update,
  );

  app.delete(
    "/:id",
    {
      preHandler: authorize("customer:delete"),
    },
    ctrl.delete,
  );
}
