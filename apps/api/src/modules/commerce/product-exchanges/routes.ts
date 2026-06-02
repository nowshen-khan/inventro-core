import { FastifyInstance } from "fastify";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { ProductExchangeController } from "./controller";
import { createProductExchangeSchema } from "./schema";

export async function productExchangeRoutes(app: FastifyInstance) {
  const ctrl = new ProductExchangeController();

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
      preHandler: [
        authorize("sale:create"),

        validate(createProductExchangeSchema),
      ],
    },
    ctrl.create,
  );
}
