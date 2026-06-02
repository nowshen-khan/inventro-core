import { FastifyReply, FastifyRequest } from "fastify";

import { DashboardService } from "./service";

const service = new DashboardService();

export class DashboardController {
  async getStats(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.getStats());
  }

  async getSalesTrend(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.getSalesTrend());
  }
}
