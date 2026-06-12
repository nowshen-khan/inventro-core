import api from "@/shared/api/client.api";
import type { AuditLog } from "@repo/types/audit";
import type { Product, ProductFilters } from "@repo/types/product";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";

export interface PaginatedProducts {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getProducts = (params?: ProductFilters) =>
  api.get<PaginatedProducts>("/products", { params }).then((res) => res.data);

export const getProduct = (id: string) =>
  api.get<Product>(`/products/${id}`).then((res) => res.data);

export const createProduct = (data: CreateProductInput) =>
  api.post("/products", data).then((res) => res.data);

export const updateProduct = (id: string, data: UpdateProductInput) =>
  api.put(`/products/${id}`, data).then((res) => res.data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`).then((res) => res.data);

export const getProductByBarcode = (barcode: string) =>
  api.get(`/products/barcode/${barcode}`).then((res) => res.data);

export const importProducts = (formData: FormData) =>
  api.post("/products/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const exportProducts = (params?: ProductFilters) =>
  api
    .get("/products/export", {
      params,
      responseType: "blob",
    })
    .then((res) => res.data as Blob);

export const posSearchProducts = (search: string) =>
  api
    .get("/products/pos-search", {
      params: {
        search,
      },
    })
    .then((res) => res.data);

export const getProductAuditLogs = (id: string) =>
  api
    .get<AuditLog[]>(`/products/${id}/audit-logs`)
    .then((res) => res.data);
