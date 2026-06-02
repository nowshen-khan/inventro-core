import { FastifyReply, FastifyRequest } from "fastify";

import { StockAdjustmentService } from "./service";

const service = new StockAdjustmentService();

export class StockAdjustmentController {
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
