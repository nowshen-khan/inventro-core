import { FastifyInstance } from "fastify";

import { authorize } from "@/core/middleware/authorize";

import { validate } from "@/core/middleware/validate";

import { StockAdjustmentController } from "./controller";

import { createStockAdjustmentSchema } from "./schema";

export async function stockAdjustmentRoutes(app: FastifyInstance) {
  const ctrl = new StockAdjustmentController();

  app.addHook("onRequest", app.authenticate);

  app.get(
    "/",
    {
      preHandler: authorize("inventory:view"),
    },
    ctrl.getAll,
  );

  app.get(
    "/:id",
    {
      preHandler: authorize("inventory:view"),
    },
    ctrl.getById,
  );

  app.post(
    "/",
    {
      preHandler: [
        authorize("inventory:update"),

        validate(createStockAdjustmentSchema),
      ],
    },
    ctrl.create,
  );
}
