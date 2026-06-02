import { brandRepository as repo } from "./repository";
import { CreateBrandInput, UpdateBrandInput } from "./schema";

export class BrandService {
  async getAll(filters?: any) {
    return repo.findAll(filters);
  }

  async getById(id: string) {
    return repo.findById(id);
  }

  async create(data: CreateBrandInput) {
    return repo.create(data);
  }

  async update(id: string, data: UpdateBrandInput) {
    await repo.findById(id);

    return repo.update(id, data);
  }

  async delete(id: string) {
    return repo.softDelete(id);
  }
}
