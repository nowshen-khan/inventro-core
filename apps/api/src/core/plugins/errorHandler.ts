import fp from "fastify-plugin";
import { AppError } from "@/core/errors/AppError";

export default fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return reply.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  });
});
