import { FastifyInstance } from "fastify";
import { InventoryController } from "./controller";
import { authorize } from "@/core/middleware/authorize";

export async function inventoryRoutes(app: FastifyInstance) {
  const ctrl = new InventoryController();
  app.addHook("onRequest", app.authenticate);
  app.get("/stock", { preHandler: authorize("inventory:view") }, ctrl.getStock);
  app.get(
    "/movements",
    { preHandler: authorize("inventory:view") },
    ctrl.getMovements,
  );
}
