import api from "@/shared/api/client.api";
import type { Branch } from "@repo/types/branch";

export const getBranches = (params?: any) =>
  api.get<Branch[]>("/branches", { params }).then((res) => res.data);

export const getBranch = (id: string) =>
  api.get<Branch[]>(`/branches/${id}`).then((res) => res.data);

export const createBranch = (data: any) =>
  api.post("/branches", data).then((res) => res.data);

export const updateBranch = (id: string, data: any) =>
  api.put(`/branches/${id}`, data).then((res) => res.data);

export const deleteBranch = (id: string) => api.delete(`/branches/${id}`);
