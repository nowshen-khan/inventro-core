import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "./service";

const service = new ProductService();

export class ProductController {
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const { page = "1", limit = "10", ...filters } = req.query as any;

    const products = await service.getAll(filters, Number(page), Number(limit));

    reply.send(products);
  }

  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.getById(req.params.id));
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    reply.status(201).send(await service.create(req.body));
  }

  async update(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const result = await service.update(req.params.id, req.body);
    reply.status(200).send({ success: true, data: result });
  }

  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    await service.delete(req.params.id);
    reply.status(204).send();
  }

  async getByBarcode(
    req: FastifyRequest<{ Params: { barcode: string } }>,
    reply: FastifyReply,
  ) {
    reply.send(await service.findByBarcode(req.params.barcode));
  }

  async importProducts(req: FastifyRequest, reply: FastifyReply) {
    const file = await req.file();

    if (!file) {
      return reply.badRequest("File is required");
    }

    const result = await service.importProducts(file);

    reply.send(result);
  }

  async exportProducts(
    req: FastifyRequest<{
      Querystring: { search?: string; categoryId?: string; brandId?: string };
    }>,
    reply: FastifyReply,
  ) {
    const buffer = await service.exportProducts(req.query);

    reply
      .header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      )
      .header("Content-Disposition", 'attachment; filename="products.xlsx"')
      .send(buffer);
  }
  async posSearch(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await service.posSearch((req.query as any).search));
  }
}
