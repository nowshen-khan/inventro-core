import { categoryRepository as repo } from "./repository";
import { CreateCategoryInput, UpdateCategoryInput } from "./schema";

export class CategoryService {
  async getAll(filters?: any) {
    return repo.findAll(filters);
  }

  async getById(id: string) {
    return repo.findById(id);
  }

  async create(data: CreateCategoryInput) {
    return repo.create(data);
  }

  async update(id: string, data: UpdateCategoryInput) {
    await repo.findById(id);

    return repo.update(id, data);
  }

  async delete(id: string) {
    return repo.softDelete(id);
  }
}
