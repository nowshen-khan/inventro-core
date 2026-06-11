import type { FastifyInstance } from "fastify";

import { stockRoutes } from "./stock/routes";
import { stockAdjustmentRoutes } from "./stock-adjustments/routes";
import { transferRoutes } from "./transfers/routes";
import { locationRoutes } from "./location/routes";

export async function registerInventoryModules(app: FastifyInstance) {
  app.register(stockRoutes, { prefix: "/inventory" });
  app.register(locationRoutes, { prefix: "/locations" });
  app.register(transferRoutes, { prefix: "/transfers" });
  app.register(stockAdjustmentRoutes, { prefix: "/stock-adjustments" });
}
