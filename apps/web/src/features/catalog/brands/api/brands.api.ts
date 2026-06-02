import api from "@/shared/api/client.api";
import type { Brand, BrandFilters } from "@repo/types";

export const getBrands = (params?: BrandFilters) =>
  api.get<Brand[]>("/brands", { params }).then((res) => res.data);

export const getBrand = (id: string) =>
  api.get<Brand>(`/brands/${id}`).then((res) => res.data);

export const createBrand = (data: any) => api.post("/brands", data);

export const updateBrand = (id: string, data: any) =>
  api.put(`/brands/${id}`, data);

export const deleteBrand = (id: string) => api.delete(`/brands/${id}`);
