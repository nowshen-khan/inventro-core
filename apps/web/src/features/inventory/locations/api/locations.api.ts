import api from "@/shared/api/client.api";
import type {
  Location,
  LocationFilters,
  CreateLocationDto,
  UpdateLocationDto,
} from "@repo/types/location";

export interface PaginatedLocations {
  items: Location[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getLocations = (params?: LocationFilters) =>
  api.get<PaginatedLocations>("/locations", { params }).then((res) => res.data);

export const getLocation = (id: string) =>
  api.get<Location>(`/locations/${id}`).then((res) => res.data);

export const createLocation = (data: CreateLocationDto) =>
  api.post("/locations", data).then((res) => res.data);

export const updateLocation = (id: string, data: UpdateLocationDto) =>
  api.put(`/locations/${id}`, data).then((res) => res.data);

export const deleteLocation = (id: string) => api.delete(`/locations/${id}`);
