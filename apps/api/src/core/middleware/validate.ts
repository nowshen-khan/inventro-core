import { FastifyRequest, FastifyReply } from "fastify";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (request.body) {
        request.body = await schema.parseAsync(request.body);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          success: false,

          message: "Validation failed",

          errors: error.flatten(),
        });
      }
      return reply.status(400).send({
        success: false,
        message: "Validation failed",
        error,
      });
    }
  };
};

const handleValidationError = (error: unknown, reply: FastifyReply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,

      message: "Validation failed",

      errors: error.flatten(),
    });
  }

  return reply.status(400).send({
    success: false,

    message: "Invalid request",
  });
};

// BODY VALIDATION

export const validateBody = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = await schema.parseAsync(request.body);
    } catch (error) {
      return handleValidationError(error, reply);
    }
  };
};

// QUERY VALIDATION

export const validateQuery = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.query = await schema.parseAsync(request.query);
    } catch (error) {
      return handleValidationError(error, reply);
    }
  };
};

// PARAMS VALIDATION

export const validateParams = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.params = await schema.parseAsync(request.params);
    } catch (error) {
      return handleValidationError(error, reply);
    }
  };
};
