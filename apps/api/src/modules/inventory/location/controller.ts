import { FastifyRequest, FastifyReply } from "fastify";
import { LocationService } from "./service";
import type {
  CreateLocationInput,
  UpdateLocationInput,
} from "@repo/schemas/location";
import { LocationFilters } from "@repo/types/location";
const service = new LocationService();

export class LocationController {
  async getAll(
    req: FastifyRequest<{ Querystring: LocationFilters }>,
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
    req: FastifyRequest<{ Body: CreateLocationInput }>,
    reply: FastifyReply,
  ) {
    reply.status(201).send(await service.create(req.body));
  }
  async update(
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateLocationInput }>,
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
