import { FastifyRequest, FastifyReply } from "fastify";
import { ReportService } from "./service";

const service = new ReportService();

export class ReportController {
  async salesReport(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.salesReport(req.query));
  }
  async purchaseReport(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.purchaseReport(req.query));
  }
  async inventoryReport(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.inventoryReport(req.query));
  }
  async profitLoss(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.profitLoss(req.query));
  }
}
