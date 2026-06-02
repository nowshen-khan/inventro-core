import { FastifyInstance } from "fastify";
import { AuthController } from "./controller";
import { validate } from "@/core/middleware/validate";
import { loginSchema } from "./schema";

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();

  app.post("/login", { preHandler: validate(loginSchema) }, controller.login);
  app.post("/refresh", controller.refresh);
  app.get(
    "/me",
    {
      preHandler: app.authenticate,
    },
    controller.me,
  );
  app.post("/logout", { preHandler: app.authenticate }, controller.logout);
  app.get(
    "/permissions",
    { preHandler: app.authenticate },
    controller.permissions,
  );
}
