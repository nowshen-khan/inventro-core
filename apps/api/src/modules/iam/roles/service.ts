import { roleRepository as repo } from "./repository";
import { CreateRoleInput, UpdateRoleInput } from "./schema";
import type { RoleFilters } from "@repo/types/rbac";
import { AppError } from "@/core/errors/AppError";

export class RoleService {
  async getAll(filters?: RoleFilters) {
    return repo.findAll(filters);
  }
  async getById(id: string) {
    return repo.findById(id);
  }
  async create(data: CreateRoleInput) {
    return repo.create(data);
  }
  async update(id: string, data: UpdateRoleInput) {
    const role = await repo.findById(id);

    if (role.name === "SUPER_ADMIN") {
      throw new AppError("Cannot modify SUPER_ADMIN", 403);
    }
    return repo.update(id, data);
  }
  async delete(id: string) {
    const role = await repo.findById(id);

    if (role.name === "SUPER_ADMIN") {
      throw new AppError("Cannot modify SUPER_ADMIN", 403);
    }
    return repo.softDelete(id);
  }
}
