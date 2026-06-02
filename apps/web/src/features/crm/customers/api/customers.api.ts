import api from "@/shared/api/client.api";
import type { Customer, CustomerFilters } from "@repo/types/common";

export const getCustomers = (params?: CustomerFilters) =>
  api.get<Customer[]>("/customers", { params }).then((res) => res.data);

export const getCustomer = (id: string) =>
  api.get<Customer>(`/customers/${id}`).then((res) => res.data);

export const createCustomer = (data: any) => api.post("/customers", data);

export const updateCustomer = (id: string, data: any) =>
  api.put(`/customers/${id}`, data);

export const deleteCustomer = (id: string) => api.delete(`/customers/${id}`);
