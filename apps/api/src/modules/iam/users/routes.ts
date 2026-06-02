import { FastifyInstance } from "fastify";
import { UserController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createUserSchema, updateUserSchema } from "./schema";

export async function userRoutes(app: FastifyInstance) {
  const ctrl = new UserController();
  app.addHook("onRequest", app.authenticate);
  app.get("/", { preHandler: authorize("user:view") }, ctrl.getAll);
  app.get("/:id", { preHandler: authorize("user:view") }, ctrl.getById);
  app.post(
    "/",
    { preHandler: [authorize("user:create"), validate(createUserSchema)] },
    ctrl.create,
  );
  app.put(
    "/:id",
    { preHandler: [authorize("user:update"), validate(updateUserSchema)] },
    ctrl.update,
  );
  app.delete("/:id", { preHandler: authorize("user:delete") }, ctrl.delete);
}
