import { branchRepository } from "./repository";
import { AppError } from "@/core/errors/AppError";

export class BranchService {
  async getAll(filters?: any) {
    return branchRepository.findAll(filters);
  }
  async getById(id: string) {
    return branchRepository.findById(id);
  }
  async create(data: any) {
    return branchRepository.create(data);
  }
  async update(id: string, data: any) {
    await branchRepository.findById(id); // ensure exists
    return branchRepository.update(id, data);
  }
  async delete(id: string) {
    return branchRepository.softDelete(id);
  }
}
