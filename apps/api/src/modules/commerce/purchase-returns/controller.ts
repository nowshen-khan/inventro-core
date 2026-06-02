import { FastifyReply, FastifyRequest } from "fastify";

import { PurchaseReturnService } from "./service.js";

import { InventoryStockService } from "@/modules/inventory/stock/stock.service.js";

const inventoryService = new InventoryStockService();

const service = new PurchaseReturnService(inventoryService);

export class PurchaseReturnController {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const data = await service.getAll();

    reply.send(data);
  }

  async getById(
    req: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const data = await service.getById(req.params.id);

    reply.send(data);
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.userId;

    const data = await service.create(req.body, userId);

    reply.status(201).send(data);
  }

  async delete(
    req: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    await service.delete(req.params.id);

    reply.status(204).send();
  }
}
