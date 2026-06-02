import api from "../../../../shared/api/client.api";
import type { Sale, CreateSalePayload } from "@repo/types";

export const getSales = (params?: any) =>
  api.get<Sale[]>("/sales", { params }).then((res) => res.data);

export const getSale = (id: string) =>
  api.get<Sale>(`/sales/${id}`).then((res) => res.data);

export const createSale = (data: CreateSalePayload) =>
  api.post("/sales", data).then((res) => res.data);
