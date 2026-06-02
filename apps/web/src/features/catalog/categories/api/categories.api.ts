import api from "@/shared/api/client.api";
import type { Category } from "@repo/types/common";

export const getCategories = (params?: any) =>
  api.get<Category[]>("/categories", { params }).then((res) => res.data);

export const getCategory = (id: string) =>
  api.get<Category>(`/categories/${id}`).then((res) => res.data);

export const createCategory = (data: any) => api.post("/categories", data);

export const updateCategory = (id: string, data: any) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);
