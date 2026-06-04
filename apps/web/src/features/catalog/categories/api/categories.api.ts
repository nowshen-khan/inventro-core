import api from "@/shared/api/client.api";
import type {
  Category,
  CategoryFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@repo/types/common";

export const getCategories = (params?: CategoryFilters) =>
  api.get("/categories", { params }).then((res) => res.data);

export const getCategory = (id: string) =>
  api.get<Category>(`/categories/${id}`).then((res) => res.data);

export const createCategory = (data: CreateCategoryPayload) =>
  api.post("/categories", data);

export const updateCategory = (id: string, data: UpdateCategoryPayload) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);
