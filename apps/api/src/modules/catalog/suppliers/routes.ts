import { FastifyInstance } from "fastify";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createSupplierSchema, updateSupplierSchema } from "./schema";
import { SupplierController } from "./controller";

export async function supplierRoutes(app: FastifyInstance) {
  const ctrl = new SupplierController();

  app.addHook("onRequest", app.authenticate);

  app.get(
    "/",
    {
      preHandler: authorize("supplier:view"),
    },
    ctrl.getAll,
  );

  app.get(
    "/:id",
    {
      preHandler: authorize("supplier:view"),
    },
    ctrl.getById,
  );

  app.post(
    "/",
    {
      preHandler: [
        authorize("supplier:create"),
        validate(createSupplierSchema),
      ],
    },
    ctrl.create,
  );

  app.put(
    "/:id",
    {
      preHandler: [
        authorize("supplier:update"),
        validate(updateSupplierSchema),
      ],
    },
    ctrl.update,
  );

  app.delete(
    "/:id",
    {
      preHandler: authorize("supplier:delete"),
    },
    ctrl.delete,
  );
}
