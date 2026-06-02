import { supplierRepository as repo } from "./repository";

export class SupplierService {
  async getAll(filters?: any) {
    return repo.findAll(filters);
  }

  async getById(id: string) {
    return repo.findById(id);
  }

  async create(data: any) {
    return repo.create(data);
  }

  async update(id: string, data: any) {
    await repo.findById(id);

    return repo.update(id, data);
  }

  async delete(id: string) {
    return repo.softDelete(id);
  }
}
