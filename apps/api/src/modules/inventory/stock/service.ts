import { inventoryRepository as repo } from "./repository";

export class InventoryQueryService {
  async getStock(filters?: any) {
    return repo.findAllStock(filters);
  }
  async getMovements(stockId?: string) {
    return repo.findMovements(stockId);
  }
}
