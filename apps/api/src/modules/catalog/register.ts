import { FastifyInstance } from "fastify";
import { brandRoutes } from "./brands/routes";
import { categoryRoutes } from "./categories/routes";
import { supplierRoutes } from "./suppliers/routes";
import { productRoutes } from "./products/routes";

export async function registerCatalogModules(app: FastifyInstance) {
  app.register(categoryRoutes, { prefix: "/categories" });
  app.register(brandRoutes, { prefix: "/brands" });
  app.register(supplierRoutes, { prefix: "/suppliers" });
  app.register(productRoutes, { prefix: "/products" });
}
