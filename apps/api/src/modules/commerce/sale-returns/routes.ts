import { FastifyInstance } from "fastify";

import { authorize } from "@/core/middleware/authorize";

import { validate } from "@/core/middleware/validate";

import { createSaleReturnSchema } from "./schema";

import { SaleReturnController } from "./controller";

export async function saleReturnRoutes(app: FastifyInstance) {
  const ctrl = new SaleReturnController();

  app.addHook("onRequest", app.authenticate);

  app.get(
    "/",
    {
      preHandler: authorize("sale:view"),
    },
    ctrl.getAll,
  );

  app.get(
    "/:id",
    {
      preHandler: authorize("sale:view"),
    },
    ctrl.getById,
  );

  app.post(
    "/",
    {
      preHandler: [authorize("sale:return"), validate(createSaleReturnSchema)],
    },
    ctrl.create,
  );
}
