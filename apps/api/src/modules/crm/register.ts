import { FastifyInstance } from "fastify";

import { customerRoutes } from "./customers/routes";

export async function registerCrmModules(app: FastifyInstance) {
  app.register(customerRoutes, { prefix: "/customers" });
}
