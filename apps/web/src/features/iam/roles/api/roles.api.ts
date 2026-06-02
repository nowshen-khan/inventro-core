import api from "@/shared/api/client.api";
import type {
  Role,
  RoleFilters,
  CreateRolePayload,
  UpdateRolePayload,
} from "@repo/types/rbac";

export const getRoles = (params?: RoleFilters) =>
  api.get<Role[]>("/roles", { params }).then((res) => res.data);

export const getRole = (id: string) =>
  api.get<Role>(`/roles/${id}`).then((res) => res.data);

export const createRole = (data: CreateRolePayload) => api.post("/roles", data);

export const updateRole = (
  id: string,
  data: { name?: string; data: UpdateRolePayload },
) => api.put(`/roles/${id}`, data);

export const deleteRole = (id: string) => api.delete(`/roles/${id}`);
