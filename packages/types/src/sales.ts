import type { Customer } from "./common";
import type { ProductVariant } from "./product";

export interface Sale {
  id: string;
  invoiceNo: string;
  locationId: string;
  customerId?: string;
  customer?: Customer;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: string;
  status: string;
  createdAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productVariantId: string;
  variant?: ProductVariant;
  quantity: number;
  sellingPrice: number;
  totalPrice: number;
}

export interface CreateSalePayload {
  invoiceNo: string;
  locationId: string;
  customerId?: string;
  items: {
    productVariantId: string;
    quantity: number;
    sellingPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax?: number;
  discount?: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: string;
}
