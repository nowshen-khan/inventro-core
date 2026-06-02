import { FastifyRequest, FastifyReply } from "fastify";
import { PurchaseService } from "./service";
import { InventoryStockService } from "@/modules/inventory/stock/stock.service";

const inventoryStockService = new InventoryStockService();
const service = new PurchaseService(inventoryStockService);

export class PurchaseController {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.getAll(req.query));
  }
  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getById(req.params.id));
  }
  async create(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.userId;
    reply.status(201).send(await service.create(req.body, userId));
  }
  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    await service.delete(req.params.id);
    reply.status(204).send();
  }
}
