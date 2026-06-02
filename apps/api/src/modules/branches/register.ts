import { FastifyInstance } from "fastify";
import { branchRoutes } from "@/modules/branches/routes";

export async function registerBranchModules(app: FastifyInstance) {
  app.register(branchRoutes, { prefix: "/branches" });
}
