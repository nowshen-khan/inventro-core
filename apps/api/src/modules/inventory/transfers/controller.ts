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

  async submit(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const userId = req.user.userId;
    await service.submit(req.params.id, userId);
    reply.send({ message: "Transfer submitted" });
  }

  async reject(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const userId = req.user.userId;
    await service.reject(req.params.id, userId);
    reply.send({ message: "Transfer rejected" });
  }

  async complete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const userId = req.user.userId;
    await service.complete(req.params.id, userId);
    reply.send({ message: "Transfer completed" });
  }

  async cancel(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const userId = req.user.userId;
    await service.cancel(req.params.id, userId);
    reply.send({ message: "Transfer cancelled" });
  }

  async report(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.report(req.query));
  }

  async auditLogs(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getAuditLogs(req.params.id));
  }

  async exportExcel(req: FastifyRequest, reply: FastifyReply) {
    const buffer = await service.exportExcel(req.query);

    reply
      .header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      )
      .header("Content-Disposition", 'attachment; filename="transfers.xlsx"')
      .send(buffer);
  }
}
