import { userRepository as repo } from "./repository";
import { hashPassword } from "@/core/lib/password";
import { AppError } from "@/core/errors/AppError";

export class UserService {
  async getAll(filters?: any) {
    return repo.findAll(filters);
  }
  async getById(id: string) {
    return repo.findById(id);
  }
  async create(data: any) {
    const existing = await repo.findAll({ email: data.email });
    if (existing.length > 0) throw new AppError("Email already exists", 400);
    const hashed = await hashPassword(data.password);
    return repo.create({ ...data, password: hashed });
  }
  async update(id: string, data: any) {
    await repo.findById(id); // ensure exists
    if (data.password) data.password = await hashPassword(data.password);
    return repo.update(id, data);
  }
  async delete(id: string) {
    return repo.softDelete(id);
  }
}
