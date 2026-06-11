export type LocationType = "WAREHOUSE" | "OUTLET" | "TRANSIT";

export interface Location {
  id: string;
  name: string;
  code: string;
  type: LocationType;

  address?: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface LocationFilters {
  search?: string;
  type?: LocationType;
  page?: number;
  limit?: number;
}

export interface CreateLocationDto {
  name: string;
  code: string;
  type: LocationType;
  address?: string;
}

export interface UpdateLocationDto {
  name?: string;
  code?: string;
  type?: LocationType;
  address?: string;
}
