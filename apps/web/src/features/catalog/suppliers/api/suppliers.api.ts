import api from "@/shared/api/client.api";
import type {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
} from "@repo/types/supplier";

export const getSuppliers = (params?: any) =>
  api.get<Supplier[]>("/suppliers", { params }).then((res) => res.data);

export const getSupplier = (id: string) =>
  api.get<Supplier>(`/suppliers/${id}`).then((res) => res.data);

export const createSupplier = (data: CreateSupplierDto) =>
  api.post("/suppliers", data);

export const updateSupplier = (id: string, data: UpdateSupplierDto) =>
  api.put(`/suppliers/${id}`, data);

export const deleteSupplier = (id: string) => api.delete(`/suppliers/${id}`);
