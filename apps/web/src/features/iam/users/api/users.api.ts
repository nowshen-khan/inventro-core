import api from "@/shared/api/client.api";
import type { User } from "@repo/types/user";

export const getUsers = (params?: any) =>
  api.get<User[]>("/users", { params }).then((res) => res.data);
export const getUser = (id: string) =>
  api.get<User[]>(`/users/${id}`).then((res) => res.data);
export const createUser = (data: any) =>
  api.post("/users", data).then((res) => res.data);
export const updateUser = (id: string, data: any) =>
  api.put(`/users/${id}`, data).then((res) => res.data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);
