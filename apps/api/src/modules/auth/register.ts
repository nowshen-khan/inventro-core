import { FastifyInstance } from "fastify";
import { authRoutes } from "./routes";

export async function registerAuthModules(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/auth" });
}
