import { FastifyInstance } from "fastify";
import { WarehouseController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createWarehouseSchema, updateWarehouseSchema } from "./schema";

export async function warehouseRoutes(app: FastifyInstance) {
  const ctrl = new WarehouseController();
  app.addHook("onRequest", app.authenticate);
  app.get("/", { preHandler: authorize("warehouse:view") }, ctrl.getAll);
  app.get("/:id", { preHandler: authorize("warehouse:view") }, ctrl.getById);
  app.post(
    "/",
    {
      preHandler: [
        authorize("warehouse:create"),
        validate(createWarehouseSchema),
      ],
    },
    ctrl.create,
  );
  app.put(
    "/:id",
    {
      preHandler: [
        authorize("warehouse:update"),
        validate(updateWarehouseSchema),
      ],
    },
    ctrl.update,
  );
  app.delete(
    "/:id",
    { preHandler: authorize("warehouse:delete") },
    ctrl.delete,
  );
}
