import { FastifyRequest, FastifyReply } from "fastify";
import { RoleService } from "./service";
import type { CreateRoleInput, UpdateRoleInput } from "./schema";

const service = new RoleService();

export class RoleController {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.getAll(req.query));
  }
  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getById(req.params.id));
  }
  async create(
    req: FastifyRequest<{
      Body: CreateRoleInput;
    }>,
    reply: FastifyReply,
  ) {
    reply.status(201).send(await service.create(req.body));
  }
  async update(
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateRoleInput }>,
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
