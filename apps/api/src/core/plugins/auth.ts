import fp from "fastify-plugin";
import { FastifyReply, FastifyRequest } from "fastify";
import { verifyAccessToken } from "@/core/auth/jwt";

export default fp(async (fastify) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.cookies.accessToken;

      if (!token) {
        return reply.status(401).send({
          message: "Missing access token",
        });
      }
      try {
        const decoded = verifyAccessToken(token);

        request.user = decoded;
      } catch {
        return reply.status(401).send({
          message: "Invalid or expired token",
        });
      }
    },
  );
});

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }

  interface FastifyRequest {
    user: {
      userId: string;
      role: string;
      locationId?: string;
    };
  }
}
