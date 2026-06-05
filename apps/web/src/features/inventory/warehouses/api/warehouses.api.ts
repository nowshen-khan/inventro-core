import api from "@/shared/api/client.api";
import type {
  Warehouse,
  WarehouseFilters,
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from "@repo/types/warehouse";

export interface PaginatedWarehouses {
  items: Warehouse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getWarehouses = (params?: WarehouseFilters) =>
  api
    .get<PaginatedWarehouses>("/warehouses", { params })
    .then((res) => res.data);

export const getWarehouse = (id: string) =>
  api.get<Warehouse>(`/warehouses/${id}`).then((res) => res.data);

export const createWarehouse = (data: CreateWarehouseDto) =>
  api.post("/warehouses", data).then((res) => res.data);

export const updateWarehouse = (id: string, data: UpdateWarehouseDto) =>
  api.put(`/warehouses/${id}`, data).then((res) => res.data);

export const deleteWarehouse = (id: string) => api.delete(`/warehouses/${id}`);
