import { FastifyRequest, FastifyReply } from "fastify";
import { StockQueryService } from "./query.service";

const service = new StockQueryService();

export class StockController {
  async getStock(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.getStock(req.query));
  }
  async getMovements(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.getMovements((req.query as any).stockId));
  }
}
