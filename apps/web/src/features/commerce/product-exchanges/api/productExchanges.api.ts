import api from "@/shared/api/client.api";

export const getProductExchanges = () =>
  api.get("/product-exchanges").then((res) => res.data);

export const getProductExchange = (id: string) =>
  api.get(`/product-exchanges/${id}`).then((res) => res.data);

export const createProductExchange = (data: any) =>
  api.post("/product-exchanges", data).then((res) => res.data);
