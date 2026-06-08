import type { FastifyInstance } from "fastify";

import { inventoryRoutes } from "./stock/routes";
import { stockAdjustmentRoutes } from "./stock-adjustments/routes";
import { transferRoutes } from "./transfers/routes";
import { locationRoutes } from "./location/routes";

export async function registerInventoryModules(app: FastifyInstance) {
  app.register(inventoryRoutes, { prefix: "/inventory" });
  app.register(locationRoutes, { prefix: "/locations" });
  app.register(transferRoutes, { prefix: "/transfers" });
  app.register(stockAdjustmentRoutes, { prefix: "/stock-adjustments" });
}
