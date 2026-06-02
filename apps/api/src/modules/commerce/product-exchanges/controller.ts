import { FastifyReply, FastifyRequest } from "fastify";
import { InventoryStockService } from "@/modules/inventory/stock/stock.service";
import { ProductExchangeService } from "./service";

const inventoryService = new InventoryStockService();

const service = new ProductExchangeService(inventoryService);

export class ProductExchangeController {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.getAll());
  }

  async getById(
    req: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getById(req.params.id));
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.userId;

    reply.status(201).send(await service.create(req.body, userId));
  }
}
