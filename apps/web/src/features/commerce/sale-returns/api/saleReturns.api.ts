import api from "@/shared/api/client.api";

export const getSaleReturns = () =>
  api.get("/sale-returns").then((res) => res.data);

export const getSaleReturn = (id: string) =>
  api.get(`/sale-returns/${id}`).then((res) => res.data);

export const createSaleReturn = (data: any) =>
  api.post("/sale-returns", data).then((res) => res.data);
