import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../api/products.api";
import type { ProductFilters } from "@repo/types/product";

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["products", filters],

    queryFn: () => getProducts(filters),
  });
};
