import { FastifyInstance } from "fastify";
import { RoleController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createRoleSchema } from "./schema";

export async function roleRoutes(app: FastifyInstance) {
  const ctrl = new RoleController();
  app.addHook("onRequest", app.authenticate);
  app.get("/", { preHandler: authorize("role:view") }, ctrl.getAll);
  app.get("/:id", { preHandler: authorize("role:view") }, ctrl.getById);
  app.post(
    "/",
    { preHandler: [authorize("role:create"), validate(createRoleSchema)] },
    ctrl.create,
  );
  app.put("/:id", { preHandler: [authorize("role:update")] }, ctrl.update);
  app.delete("/:id", { preHandler: authorize("role:delete") }, ctrl.delete);
}
