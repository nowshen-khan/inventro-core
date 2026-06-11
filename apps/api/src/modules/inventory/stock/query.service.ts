import { stockRepository as repo } from "./repository";

export class StockQueryService {
  async getStock(filters?: any) {
    return repo.findAllStock(filters);
  }
  async getMovements(stockId?: string) {
    return repo.findMovements(stockId);
  }
}
