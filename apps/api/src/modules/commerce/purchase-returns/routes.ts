import { FastifyInstance } from "fastify";

import { PurchaseReturnController } from "./controller.js";

import { authorize } from "@/core/middleware/authorize";

import { validate } from "@/core/middleware/validate";

import { createPurchaseReturnSchema } from "./schema.js";

export async function purchaseReturnRoutes(app: FastifyInstance) {
  const ctrl = new PurchaseReturnController();

  app.addHook("onRequest", app.authenticate);

  app.get(
    "/",
    {
      preHandler: authorize("purchase:view"),
    },
    ctrl.getAll,
  );

  app.get(
    "/:id",
    {
      preHandler: authorize("purchase:view"),
    },
    ctrl.getById,
  );

  app.post(
    "/",
    {
      preHandler: [
        authorize("purchase:create"),

        validate(createPurchaseReturnSchema),
      ],
    },
    ctrl.create,
  );

  app.delete(
    "/:id",
    {
      preHandler: authorize("purchase:delete"),
    },
    ctrl.delete,
  );
}
