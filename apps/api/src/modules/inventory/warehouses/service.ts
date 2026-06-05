import { warehouseRepository } from "./repository";
import type { CreateWarehouseInput, UpdateWarehouseInput } from "./schema";

import type { WarehouseFilters } from "@repo/types/warehouse";

export class WarehouseService {
  async getAll(filters?: WarehouseFilters) {
    return warehouseRepository.findAll(filters);
  }
  async getById(id: string) {
    return warehouseRepository.findById(id);
  }
  async create(data: CreateWarehouseInput) {
    return warehouseRepository.create(data);
  }
  async update(id: string, data: UpdateWarehouseInput) {
    await warehouseRepository.findById(id);
    return warehouseRepository.update(id, data);
  }
  async delete(id: string) {
    return warehouseRepository.softDelete(id);
  }
}
