import { FastifyInstance } from "fastify";
import { LocationController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createLocationSchema, updateLocationSchema } from "./schema";

export async function locationRoutes(app: FastifyInstance) {
  const ctrl = new LocationController();
  app.addHook("onRequest", app.authenticate);
  app.get("/", { preHandler: authorize("location:view") }, ctrl.getAll);
  app.get("/:id", { preHandler: authorize("location:view") }, ctrl.getById);
  app.post(
    "/",
    {
      preHandler: [
        authorize("location:create"),
        validate(createLocationSchema),
      ],
    },
    ctrl.create,
  );
  app.put(
    "/:id",
    {
      preHandler: [
        authorize("location:update"),
        validate(updateLocationSchema),
      ],
    },
    ctrl.update,
  );
  app.delete("/:id", { preHandler: authorize("location:delete") }, ctrl.delete);
}
