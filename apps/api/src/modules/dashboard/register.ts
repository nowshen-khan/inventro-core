import { FastifyInstance } from "fastify";
import { dashboardRoutes } from "./routes";

export async function registerDashbaordModules(app: FastifyInstance) {
  app.register(dashboardRoutes, { prefix: "/dashboard" });
}
