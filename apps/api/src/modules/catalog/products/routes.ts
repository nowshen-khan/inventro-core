import { FastifyInstance } from "fastify";
import { ProductController } from "./controller";
import { authorize } from "@/core/middleware/authorize";
import { validate } from "@/core/middleware/validate";
import { createProductSchema, updateProductSchema } from "./schema";

export async function productRoutes(app: FastifyInstance) {
  const ctrl = new ProductController();
  app.addHook("onRequest", app.authenticate);

  app.post(
    "/import",
    {
      preHandler: authorize("product:create"),
    },
    ctrl.importProducts,
  );

  app.get(
    "/export",
    {
      preHandler: authorize("product:view"),
    },
    ctrl.exportProducts,
  );

  app.get(
    "/barcode/:barcode",
    { preHandler: authorize("product:view") },
    ctrl.getByBarcode,
  );

  app.get("/", { preHandler: authorize("product:view") }, ctrl.getAll);

  app.get(
    "/pos-search",
    {
      preHandler: authorize("sale:create"),
    },
    ctrl.posSearch,
  );

  app.get("/:id", { preHandler: authorize("product:view") }, ctrl.getById);

  app.post(
    "/",
    {
      preHandler: [authorize("product:create"), validate(createProductSchema)],
    },
    ctrl.create,
  );

  app.put(
    "/:id",
    {
      preHandler: [authorize("product:update"), validate(updateProductSchema)],
    },
    ctrl.update,
  );

  app.delete("/:id", { preHandler: authorize("product:delete") }, ctrl.delete);
}
