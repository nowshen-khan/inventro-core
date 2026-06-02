import api from "@/shared/api/client.api";

export const getSalesReport = (params?: any) =>
  api.get("/reports/sales", { params }).then((res) => res.data);

export const getPurchaseReport = (params?: any) =>
  api.get("/reports/purchases", { params }).then((res) => res.data);

export const getInventoryReport = (params?: any) =>
  api.get("/reports/inventory", { params }).then((res) => res.data);

export const getProfitLoss = (params?: any) =>
  api.get("/reports/profit-loss", { params }).then((res) => res.data);
