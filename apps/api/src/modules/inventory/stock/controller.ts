import { FastifyRequest, FastifyReply } from "fastify";
import { InventoryQueryService } from "./service";

const service = new InventoryQueryService();

export class InventoryController {
  async getStock(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.getStock(req.query));
  }
  async getMovements(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.getMovements((req.query as any).stockId));
  }
}
