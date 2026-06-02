import api from "@/shared/api/client.api";

export const getDashboardStats = () =>
  api.get("/dashboard/stats").then((res) => res.data);

export const getSalesTrend = () =>
  api.get("/dashboard/sales-trend").then((res) => res.data);
