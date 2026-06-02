import { customerRepository } from "./repository";
import { CreateCustomerInput, UpdateCustomerInput } from "./schema";

export class CustomerService {
  async getAll(filters?: any) {
    return customerRepository.findAll(filters);
  }

  async getById(id: string) {
    return customerRepository.findById(id);
  }

  async create(data: CreateCustomerInput) {
    return customerRepository.create(data);
  }

  async update(id: string, data: UpdateCustomerInput) {
    await customerRepository.findById(id);

    return customerRepository.update(id, data);
  }

  async delete(id: string) {
    return customerRepository.softDelete(id);
  }
}
