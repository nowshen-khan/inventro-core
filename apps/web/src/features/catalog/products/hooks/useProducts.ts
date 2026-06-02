import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../api/products.api";

export const useProducts = (filters?: any) => {
  return useQuery({
    queryKey: ["products", filters],

    queryFn: () => getProducts(filters),
  });
};
