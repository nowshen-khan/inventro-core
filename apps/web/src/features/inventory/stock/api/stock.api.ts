import api from "@/shared/api/client.api";

export const getStock = (params?: any) =>
  api.get("/inventory/stock", { params }).then((res) => res.data);

export const getStockMovements = (stockId?: string) =>
  api
    .get("/inventory/movements", { params: { stockId } })
    .then((res) => res.data);
