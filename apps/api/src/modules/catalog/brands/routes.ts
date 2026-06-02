import { FastifyInstance } from "fastify";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createBrandSchema, updateBrandSchema } from "./schema";
import { BrandController } from "./controller";

export async function brandRoutes(app: FastifyInstance) {
  const ctrl = new BrandController();

  app.addHook("onRequest", app.authenticate);

  app.get(
    "/",
    {
      preHandler: authorize("brand:view"),
    },
    ctrl.getAll,
  );

  app.get(
    "/:id",
    {
      preHandler: authorize("brand:view"),
    },
    ctrl.getById,
  );

  app.post(
    "/",
    {
      preHandler: [authorize("brand:create"), validate(createBrandSchema)],
    },
    ctrl.create,
  );

  app.put(
    "/:id",
    {
      preHandler: [authorize("brand:update"), validate(updateBrandSchema)],
    },
    ctrl.update,
  );

  app.delete(
    "/:id",
    {
      preHandler: authorize("brand:delete"),
    },
    ctrl.delete,
  );
}
