import api from "@/shared/api/client.api";
import type { Purchase, CreatePurchasePayload } from "@repo/types/purchases";

export const getPurchases = (params?: any) =>
  api.get<Purchase[]>("/purchases", { params }).then((res) => res.data);
export const getPurchase = (id: string) =>
  api.get<Purchase>(`/purchases/${id}`).then((res) => res.data);
export const createPurchase = (data: CreatePurchasePayload) =>
  api.post("/purchases", data).then((res) => res.data);
export const deletePurchase = (id: string) => api.delete(`/purchases/${id}`);
