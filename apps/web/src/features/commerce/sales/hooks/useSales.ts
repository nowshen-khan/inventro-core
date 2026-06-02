import { useQuery } from "@tanstack/react-query";

import { getSales } from "../api/sales.api";

export const useSales = (filters?: any) => {
  return useQuery({
    queryKey: ["sales", filters],

    queryFn: () => getSales(filters),
  });
};
