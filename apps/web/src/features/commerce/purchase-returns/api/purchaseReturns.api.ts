import api from "@/shared/api/client.api";

export const getPurchaseReturns = (params?: any) =>
  api
    .get("/purchase-returns", {
      params,
    })
    .then((res) => res.data);

export const getPurchaseReturn = (id: string) =>
  api.get(`/purchase-returns/${id}`).then((res) => res.data);

export const createPurchaseReturn = (data: any) =>
  api.post("/purchase-returns", data).then((res) => res.data);

export const deletePurchaseReturn = (id: string) =>
  api.delete(`/purchase-returns/${id}`);
