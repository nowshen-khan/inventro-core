import { FastifyInstance } from "fastify";
import { PurchaseController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createPurchaseSchema } from "./schema";

export async function purchaseRoutes(app: FastifyInstance) {
  const ctrl = new PurchaseController();
  app.addHook("onRequest", app.authenticate);
  app.get("/", { preHandler: authorize("purchase:view") }, ctrl.getAll);
  app.get("/:id", { preHandler: authorize("purchase:view") }, ctrl.getById);
  app.post(
    "/",
    {
      preHandler: [
        authorize("purchase:create"),
        validate(createPurchaseSchema),
      ],
    },
    ctrl.create,
  );
  app.delete("/:id", { preHandler: authorize("purchase:delete") }, ctrl.delete);
}
