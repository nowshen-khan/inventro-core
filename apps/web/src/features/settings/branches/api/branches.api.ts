import api from "@/shared/api/client.api";
import type { Branch } from "@repo/types/branch";

export interface PaginatedBranches {
  items: Branch[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getBranches = (params?: any) =>
  api.get<PaginatedBranches>("/branches", { params }).then((res) => res.data);

export const getBranch = (id: string) =>
  api.get<Branch>(`/branches/${id}`).then((res) => res.data);

export const createBranch = (data: any) =>
  api.post("/branches", data).then((res) => res.data);

export const updateBranch = (id: string, data: any) =>
  api.put(`/branches/${id}`, data).then((res) => res.data);

export const deleteBranch = (id: string) => api.delete(`/branches/${id}`);
