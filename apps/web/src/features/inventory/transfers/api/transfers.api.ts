import api from "@/shared/api/client.api";
import type { Transfer, CreateTransferPayload } from "@repo/types/transfers";

export const getTransfers = (params?: any) =>
  api.get<Transfer[]>("/transfers", { params }).then((res) => res.data);

export const getTransfer = (id: string) =>
  api.get<Transfer>(`/transfers/${id}`).then((res) => res.data);

export const createTransfer = (data: CreateTransferPayload) =>
  api.post("/transfers", data).then((res) => res.data);

export const approveTransfer = (id: string) =>
  api.put(`/transfers/${id}/approve`);
