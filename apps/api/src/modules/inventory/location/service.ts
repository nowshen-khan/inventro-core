import { locationRepository } from "./repository";
import type { CreateLocationInput, UpdateLocationInput } from "./schema";

import type { LocationFilters } from "@repo/types/location";

export class LocationService {
  async getAll(filters?: LocationFilters) {
    return locationRepository.findAll(filters);
  }
  async getById(id: string) {
    return locationRepository.findById(id);
  }
  async create(data: CreateLocationInput) {
    try {
      return await locationRepository.create(data);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Location code already exists");
      }

      throw error;
    }
  }
  async update(id: string, data: UpdateLocationInput) {
    await locationRepository.findById(id);
    return locationRepository.update(id, data);
  }
  async delete(id: string) {
    return locationRepository.softDelete(id);
  }
}
