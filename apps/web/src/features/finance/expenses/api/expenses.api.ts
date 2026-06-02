import api from "@/shared/api/client.api";

export const getExpenses = (params?: any) =>
  api.get("/expenses", { params }).then((res) => res.data);

export const getExpense = (id: string) =>
  api.get(`/expenses/${id}`).then((res) => res.data);

export const createExpense = (data: any) =>
  api.post("/expenses", data).then((res) => res.data);

export const updateExpense = (id: string, data: any) =>
  api.put(`/expenses/${id}`, data).then((res) => res.data);

export const deleteExpense = (id: string) => api.delete(`/expenses/${id}`);
