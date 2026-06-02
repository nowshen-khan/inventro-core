import type { Category } from "./common";
import type { Brand } from "./common";
import type { Supplier } from "./common";

export interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  category: Category;
  brandId?: string;
  brand?: Brand;
  supplierId?: string;
  supplier?: Supplier;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  attributes: Record<string, string>;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  brandId?: string;
  supplierId?: string;
  branchId?: string;
  warehouseId?: string;
  lowStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
