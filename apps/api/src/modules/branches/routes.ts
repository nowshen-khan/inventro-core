import { FastifyInstance } from "fastify";
import { BranchController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createBranchSchema, updateBranchSchema } from "./schema";

export async function branchRoutes(app: FastifyInstance) {
  const controller = new BranchController();
  app.addHook("onRequest", app.authenticate);
  app.get("/", { preHandler: authorize("branch:view") }, controller.getAll);
  app.get("/:id", { preHandler: authorize("branch:view") }, controller.getById);
  app.post(
    "/",
    { preHandler: [authorize("branch:create"), validate(createBranchSchema)] },
    controller.create,
  );
  app.put(
    "/:id",
    { preHandler: [authorize("branch:update"), validate(updateBranchSchema)] },
    controller.update,
  );
  app.delete(
    "/:id",
    { preHandler: authorize("branch:delete") },
    controller.delete,
  );
}
