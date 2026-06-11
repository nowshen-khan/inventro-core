import { FastifyInstance } from "fastify";
import { TransferController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createTransferSchema } from "./schema";

export async function transferRoutes(app: FastifyInstance) {
  const ctrl = new TransferController();
  app.addHook("onRequest", app.authenticate);
  app.get("/report", { preHandler: authorize("transfer:report") }, ctrl.report);
  app.get(
    "/export",
    { preHandler: authorize("transfer:export") },
    ctrl.exportExcel,
  );
  app.get("/", { preHandler: authorize("transfer:view") }, ctrl.getAll);
  app.get(
    "/:id/audit-logs",
    { preHandler: authorize("transfer:audit") },
    ctrl.auditLogs,
  );
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
    "/:id/submit",
    { preHandler: authorize("transfer:create") },
    ctrl.submit,
  );
  app.put(
    "/:id/approve",
    { preHandler: authorize("transfer:approve") },
    ctrl.approve,
  );
  app.put(
    "/:id/reject",
    { preHandler: authorize("transfer:reject") },
    ctrl.reject,
  );
  app.put(
    "/:id/complete",
    { preHandler: authorize("transfer:complete") },
    ctrl.complete,
  );
  app.put(
    "/:id/cancel",
    { preHandler: authorize("transfer:cancel") },
    ctrl.cancel,
  );
}
