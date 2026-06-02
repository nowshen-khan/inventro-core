import api from "@/shared/api/client.api";
import type { Warehouse } from "@repo/types/warehouse";

export const getWarehouses = (params?: any) =>
  api.get<Warehouse[]>("/warehouses", { params }).then((res) => res.data);

export const getWarehouse = (id: string) =>
  api.get<Warehouse[]>(`/warehouses/${id}`).then((res) => res.data);

export const createWarehouse = (data: any) =>
  api.post("/warehouses", data).then((res) => res.data);

export const updateWarehouse = (id: string, data: any) =>
  api.put(`/warehouses/${id}`, data).then((res) => res.data);

export const deleteWarehouse = (id: string) => api.delete(`/warehouses/${id}`);
