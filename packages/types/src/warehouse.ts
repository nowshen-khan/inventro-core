import type { Branch } from "./branch";

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  branchId: string;
  branch?: Branch;

  createdAt: string;
  updatedAt: string;
}

export interface WarehouseFilters {
  search?: string;
  branchId?: string;
  page?: number;
  limit?: number;
}

export interface CreateWarehouseDto {
  name: string;
  code: string;
  branchId: string;
}

export interface UpdateWarehouseDto {
  name?: string;
  code?: string;
  branchId?: string;
}
