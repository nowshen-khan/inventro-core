import type { Warehouse } from "./location";
import type { ProductVariant } from "./product";

export interface Transfer {
  id: string;
  transferNo: string;
  sourceWarehouseId: string;
  sourceWarehouse?: Warehouse;
  destWarehouseId: string;
  destWarehouse?: Warehouse;
  items: TransferItem[];
  status: string;
  createdAt: string;
}

export interface TransferItem {
  id: string;
  transferId: string;
  productVariantId: string;
  variant?: ProductVariant;
  quantity: number;
}

export interface CreateTransferPayload {
  transferNo: string;
  sourceWarehouseId: string;
  destWarehouseId: string;
  items: { productVariantId: string; quantity: number }[];
}
