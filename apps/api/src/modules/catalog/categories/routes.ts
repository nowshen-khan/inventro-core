import { FastifyInstance } from "fastify";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createCategorySchema, updateCategorySchema } from "./schema";
import { CategoryController } from "./controller";

export async function categoryRoutes(app: FastifyInstance) {
  const ctrl = new CategoryController();

  app.addHook("onRequest", app.authenticate);

  app.get(
    "/",
    {
      preHandler: authorize("category:view"),
    },
    ctrl.getAll,
  );

  app.get(
    "/:id",
    {
      preHandler: authorize("category:view"),
    },
    ctrl.getById,
  );

  app.post(
    "/",
    {
      preHandler: [
        authorize("category:create"),
        validate(createCategorySchema),
      ],
    },
    ctrl.create,
  );

  app.put(
    "/:id",
    {
      preHandler: [
        authorize("category:update"),
        validate(updateCategorySchema),
      ],
    },
    ctrl.update,
  );

  app.delete(
    "/:id",
    {
      preHandler: authorize("category:delete"),
    },
    ctrl.delete,
  );
}
