import api from "@/shared/api/client.api";
import type {
  Brand,
  BrandFilters,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@repo/types/common";

export const getBrands = (params?: BrandFilters) =>
  api.get<Brand[]>("/brands", { params }).then((res) => res.data);

export const getBrand = (id: string) =>
  api.get<Brand>(`/brands/${id}`).then((res) => res.data);

export const createBrand = (data: CreateCategoryPayload) =>
  api.post("/brands", data);

export const updateBrand = (id: string, data: UpdateCategoryPayload) =>
  api.put(`/brands/${id}`, data);

export const deleteBrand = (id: string) => api.delete(`/brands/${id}`);
