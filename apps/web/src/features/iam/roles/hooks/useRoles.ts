import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../api/roles.api";
import type { RoleFilters } from "@repo/types/rbac";

export const useRoles = (params?: RoleFilters) =>
  useQuery({ queryKey: ["roles", params], queryFn: () => getRoles(params) });
