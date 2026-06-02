import { FastifyInstance } from "fastify";

import { authorize } from "@/core/middleware/authorize";

import { DashboardController } from "./controller";

export async function dashboardRoutes(app: FastifyInstance) {
  const ctrl = new DashboardController();

  app.addHook("onRequest", app.authenticate);

  app.get(
    "/stats",
    {
      preHandler: authorize("dashboard:view"),
    },
    ctrl.getStats,
  );

  app.get(
    "/sales-trend",
    {
      preHandler: authorize("dashboard:view"),
    },
    ctrl.getSalesTrend,
  );
}
