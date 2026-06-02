import api from "@/shared/api/client.api";
import type { Product, ProductFilters } from "@repo/types/product";

export const getProducts = (params?: ProductFilters) =>
  api.get<Product[]>("/products", { params }).then((res) => res.data);

export const getProduct = (id: string) =>
  api.get<Product>(`/products/${id}`).then((res) => res.data);

export const createProduct = (data: any) =>
  api.post("/products", data).then((res) => res.data);

export const updateProduct = (id: string, data: any) =>
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

export const posSearchProducts = (search: string) =>
  api
    .get("/products/pos-search", {
      params: {
        search,
      },
    })
    .then((res) => res.data);
