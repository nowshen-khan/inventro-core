import api from "@/shared/api/client.api";

export const getStockAdjustments = () =>
  api.get("/stock-adjustments").then((res) => res.data);

export const getStockAdjustment = (id: string) =>
  api.get(`/stock-adjustments/${id}`).then((res) => res.data);

export const createStockAdjustment = (data: any) =>
  api.post("/stock-adjustments", data).then((res) => res.data);
