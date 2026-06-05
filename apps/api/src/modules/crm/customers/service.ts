import { customerRepository } from "./repository";
import { CreateCustomerInput, UpdateCustomerInput } from "./schema";
import { CustomerFilters } from "@repo/types/common";

export class CustomerService {
  async getAll(filters?: CustomerFilters) {
    return customerRepository.findAll(filters);
  }

  async getById(id: string) {
    return customerRepository.findById(id);
  }

  async create(data: CreateCustomerInput) {
    try {
      return await customerRepository.create({
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Phone or Email already exists");
      }

      throw error;
    }
  }

  async update(id: string, data: UpdateCustomerInput) {
    await customerRepository.findById(id);

    return await customerRepository.update(id, {
      ...data,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
    });
  }

  async delete(id: string) {
    return customerRepository.softDelete(id);
  }
}
