import { FastifyInstance } from "fastify";
import { expenseRoutes } from "./expenses/routes";

export async function registerFinanceModules(app: FastifyInstance) {
  app.register(expenseRoutes, { prefix: "/expenses" });
}
