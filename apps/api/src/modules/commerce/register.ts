import { FastifyInstance } from "fastify";

import { productExchangeRoutes } from "./product-exchanges/routes";
import { purchaseReturnRoutes } from "./purchase-returns/routes";
import { purchaseRoutes } from "./purchases/routes";
import { saleReturnRoutes } from "./sale-returns/routes";
import { saleRoutes } from "./sales/routes";

export async function registerCommerceModules(app: FastifyInstance) {
  app.register(purchaseRoutes, { prefix: "/purchases" });
  app.register(purchaseReturnRoutes, { prefix: "/purchase-returns" });
  app.register(saleRoutes, { prefix: "/sales" });
  app.register(saleReturnRoutes, {
    prefix: "/sale-returns",
  });
  app.register(productExchangeRoutes, {
    prefix: "/product-exchanges",
  });
}
