import "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthUser } from "@repo/types/auth";

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}
