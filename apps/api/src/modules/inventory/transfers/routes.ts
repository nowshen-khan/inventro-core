import { FastifyInstance } from "fastify";
import { TransferController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createTransferSchema } from "./schema";

export async function transferRoutes(app: FastifyInstance) {
  const ctrl = new TransferController();
  app.addHook("onRequest", app.authenticate);
  app.get("/", { preHandler: authorize("transfer:view") }, ctrl.getAll);
  app.get("/:id", { preHandler: authorize("transfer:view") }, ctrl.getById);
  app.post(
    "/",
    {
      preHandler: [
        authorize("transfer:create"),
        validate(createTransferSchema),
      ],
    },
    ctrl.create,
  );
  app.put(
    "/:id/approve",
    { preHandler: authorize("transfer:approve") },
    ctrl.approve,
  );
}
