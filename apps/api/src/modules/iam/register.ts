import { FastifyInstance } from "fastify";
import { userRoutes } from "./users/routes";
import { roleRoutes } from "./roles/routes";

export async function registerIamModules(app: FastifyInstance) {
  app.register(userRoutes, { prefix: "/users" });
  app.register(roleRoutes, { prefix: "/roles" });
}
