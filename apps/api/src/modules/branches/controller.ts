import { FastifyRequest, FastifyReply } from "fastify";
import { BranchService } from "./service";

const service = new BranchService();

export class BranchController {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const branches = await service.getAll(req.query);
    reply.send(branches);
  }
  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getById(req.params.id));
  }
  async create(req: FastifyRequest, reply: FastifyReply) {
    reply.status(201).send(await service.create(req.body));
  }
  async update(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.update(req.params.id, req.body));
  }
  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    await service.delete(req.params.id);
    reply.status(204).send();
  }
}
