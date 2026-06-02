import { FastifyInstance } from "fastify";
import { authorize } from "@/core/middleware/authorize";

import { ReportController } from "./controller";

export async function reportRoutes(app: FastifyInstance) {
  const ctrl = new ReportController();
  app.addHook("onRequest", app.authenticate);
  app.get("/sales", { preHandler: authorize("report:view") }, ctrl.salesReport);
  app.get(
    "/purchases",
    { preHandler: authorize("report:view") },
    ctrl.purchaseReport,
  );
  app.get(
    "/inventory",
    { preHandler: authorize("report:view") },
    ctrl.inventoryReport,
  );
  app.get(
    "/profit-loss",
    { preHandler: authorize("report:view") },
    ctrl.profitLoss,
  );
}
