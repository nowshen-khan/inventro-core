import type { Supplier } from "./supplier";
import type { Branch } from "./branch";
import type { ProductVariant } from "./product";

export interface Purchase {
  id: string;
  invoiceNo: string;
  supplierId: string;
  supplier?: Supplier;
  branchId: string;
  branch?: Branch;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  dueDate?: string;
  status: string;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productVariantId: string;
  variant?: ProductVariant;
  quantity: number;
  costPrice: number;
  totalPrice: number;
}

export interface CreatePurchasePayload {
  invoiceNo: string;
  supplierId: string;
  branchId: string;
  warehouseId: string;
  items: {
    productVariantId: string;
    quantity: number;
    costPrice: number;
    totalPrice: number;
  }[];
  paidAmount?: number;
  dueDate?: string;
}
