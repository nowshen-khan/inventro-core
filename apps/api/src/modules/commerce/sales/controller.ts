import { FastifyRequest, FastifyReply } from "fastify";
import { SaleService } from "./service";
import { InventoryStockService } from "@/modules/inventory/stock/stock.service";

const inventoryStockService = new InventoryStockService();
const service = new SaleService(inventoryStockService);

export class SaleController {
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
}
