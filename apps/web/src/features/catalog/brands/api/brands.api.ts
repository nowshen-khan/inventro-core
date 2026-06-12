import api from "@/shared/api/client.api";
import type {
  Brand,
  BrandFilters,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "@repo/types/common";

export interface PaginatedBrands {
  items: Brand[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getBrands = (params?: BrandFilters) =>
  api.get<PaginatedBrands>("/brands", { params }).then((res) => res.data);

export const getBrand = (id: string) =>
  api.get<Brand>(`/brands/${id}`).then((res) => res.data);

export const createBrand = (data: CreateBrandPayload) =>
  api.post("/brands", data);

export const updateBrand = (id: string, data: UpdateBrandPayload) =>
  api.put(`/brands/${id}`, data);

export const deleteBrand = (id: string) => api.delete(`/brands/${id}`);
