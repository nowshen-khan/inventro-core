import { FastifyInstance } from "fastify";
import { StockController } from "./controller";
import { authorize } from "@/core/middleware/authorize";

export async function stockRoutes(app: FastifyInstance) {
  const ctrl = new StockController();
  app.addHook("onRequest", app.authenticate);
  app.get("/stock", { preHandler: authorize("stock:view") }, ctrl.getStock);
  app.get(
    "/movements",
    { preHandler: authorize("stock:view") },
    ctrl.getMovements,
  );
}
