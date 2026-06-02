import { FastifyRequest, FastifyReply } from "fastify";
import { TransferService } from "./service";
import { InventoryStockService } from "../stock/stock.service";

const inventoryStockService = new InventoryStockService();
const service = new TransferService(inventoryStockService);

export class TransferController {
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
  async approve(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const userId = req.user.userId;
    await service.approve(req.params.id, userId);
    reply.send({ message: "Transfer approved" });
  }
}
