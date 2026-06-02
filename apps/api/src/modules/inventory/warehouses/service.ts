import { warehouseRepository } from "./repository";

export class WarehouseService {
  async getAll(filters?: any) {
    return warehouseRepository.findAll(filters);
  }
  async getById(id: string) {
    return warehouseRepository.findById(id);
  }
  async create(data: any) {
    return warehouseRepository.create(data);
  }
  async update(id: string, data: any) {
    await warehouseRepository.findById(id);
    return warehouseRepository.update(id, data);
  }
  async delete(id: string) {
    return warehouseRepository.softDelete(id);
  }
}
