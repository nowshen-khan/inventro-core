import type { Category } from "./common";
import type { Brand } from "./common";
import type { Supplier } from "./supplier";

export type ProductGender =
  | "MALE"
  | "FEMALE"
  | "UNISEX"
  | "BOYS"
  | "GIRLS"
  | "KIDS";

export interface Product {
  id: string;
  name: string;
  styleCode: string;
  description?: string;
  categoryId: string;
  category: Category;
  brandId?: string | null;
  brand?: Brand | null;
  supplierId?: string | null;
  supplier?: Supplier | null;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode?: string | null;
  color?: string | null;
  size?: string | null;
  gender?: ProductGender | null;
  attributes?: Record<string, string>;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
  reorderLevel: number;
  stocks: ProductStock[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface ProductStock {
  id: string;
  locationId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity?: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  brandId?: string;
  supplierId?: string;
  locationId?: string;
  lowStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
