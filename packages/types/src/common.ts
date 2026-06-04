export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface CategoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface BrandFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerFilters {
  search?: string;
  branchId?: string;
  page?: number;
  limit?: number;
}
