import api from "@/shared/api/client.api";
import type {
  Customer,
  CustomerFilters,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@repo/types/common";

export interface PaginatedCustomers {
  items: Customer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getCustomers = (params?: CustomerFilters) =>
  api.get<PaginatedCustomers>("/customers", { params }).then((res) => res.data);

export const getCustomer = (id: string) =>
  api.get<Customer>(`/customers/${id}`).then((res) => res.data);

export const createCustomer = (data: CreateCustomerPayload) =>
  api.post("/customers", data);

export const updateCustomer = (id: string, data: UpdateCustomerPayload) =>
  api.put(`/customers/${id}`, data);

export const deleteCustomer = (id: string) => api.delete(`/customers/${id}`);
