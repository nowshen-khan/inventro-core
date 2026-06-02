import { expenseRepository as repo } from "./repository";

export class ExpenseService {
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
    return repo.update(id, data);
  }
  async delete(id: string) {
    return repo.delete(id);
  }
}
