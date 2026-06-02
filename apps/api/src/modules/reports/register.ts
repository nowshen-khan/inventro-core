import { FastifyInstance } from "fastify";
import { reportRoutes } from "@/modules/reports/routes";

export async function registerReportModules(app: FastifyInstance) {
  app.register(reportRoutes, { prefix: "/reports" });
}
