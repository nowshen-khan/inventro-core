import { FastifyReply, FastifyRequest } from "fastify";

import { CustomerService } from "./service";
import { CreateCustomerInput, UpdateCustomerInput } from "./schema";
import { CustomerFilters } from "@repo/types/common";

const service = new CustomerService();

export class CustomerController {
  async getAll(
    req: FastifyRequest<{
      Querystring: CustomerFilters;
    }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getAll(req.query));
  }

  async getById(
    req: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getById(req.params.id));
  }

  async create(
    req: FastifyRequest<{ Body: CreateCustomerInput }>,
    reply: FastifyReply,
  ) {
    reply.status(201).send(await service.create(req.body));
  }

  async update(
    req: FastifyRequest<{
      Params: { id: string };
      Body: UpdateCustomerInput;
    }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.update(req.params.id, req.body));
  }

  async delete(
    req: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply,
  ) {
    await service.delete(req.params.id);

    reply.status(204).send();
  }
}
