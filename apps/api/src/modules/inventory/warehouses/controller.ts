import { FastifyRequest, FastifyReply } from "fastify";
import { WarehouseService } from "./service";
import type {
  CreateWarehouseInput,
  UpdateWarehouseInput,
} from "@repo/schemas/warehouse";
import { WarehouseFilters } from "@repo/types";
const service = new WarehouseService();

export class WarehouseController {
  async getAll(
    req: FastifyRequest<{ Querystring: WarehouseFilters }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getAll(req.query));
  }
  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getById(req.params.id));
  }
  async create(
    req: FastifyRequest<{ Body: CreateWarehouseInput }>,
    reply: FastifyReply,
  ) {
    reply.status(201).send(await service.create(req.body));
  }
  async update(
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateWarehouseInput }>,
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
