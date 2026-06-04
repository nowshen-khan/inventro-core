import { supplierRepository as repo } from "./repository";
import type {
  SupplierFilters,
  CreateSupplierDto,
  UpdateSupplierDto,
} from "@repo/types/supplier";

export class SupplierService {
  async getAll(filters?: SupplierFilters) {
    return repo.findAll(filters || {});
  }

  async getById(id: string) {
    return repo.findById(id);
  }

  async create(data: CreateSupplierDto) {
    return repo.create(data);
  }

  async update(id: string, data: UpdateSupplierDto) {
    await repo.findById(id);

    return repo.update(id, data);
  }

  async delete(id: string) {
    return repo.softDelete(id);
  }
}
