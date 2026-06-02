import type { ProductVariant } from "./product";
import type { Warehouse } from "./warehouse";

export interface Stock {
  id: string;
  productVariantId: string;
  branchId: string;
  warehouseId: string;
  quantity: number;
  variant?: ProductVariant;
  warehouse?: Warehouse;
}
