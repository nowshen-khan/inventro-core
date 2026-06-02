import { FastifyInstance } from "fastify";
import { SaleController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createSaleSchema } from "./schema";

export async function saleRoutes(app: FastifyInstance) {
  const ctrl = new SaleController();
  app.addHook("onRequest", app.authenticate);
  app.get("/", { preHandler: authorize("sale:view") }, ctrl.getAll);
  app.get("/:id", { preHandler: authorize("sale:view") }, ctrl.getById);
  app.post(
    "/",
    { preHandler: [authorize("sale:create"), validate(createSaleSchema)] },
    ctrl.create,
  );
}
