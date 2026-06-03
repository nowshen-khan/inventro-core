export interface Permission {
  id: string;
  action: string;
}

export interface RolePermission {
  permission: Permission;
}

export interface Role {
  id: string;
  name: string;
  permissions?: RolePermission[];
}

export interface RoleFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateRolePayload {
  name: string;
  permissions?: string[];
}

export interface UpdateRolePayload {
  name?: string;
  permissions?: string[];
}
