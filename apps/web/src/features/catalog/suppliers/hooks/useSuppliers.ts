import { useQuery } from "@tanstack/react-query";
import type { SupplierFilters } from "@repo/types/supplier";

import { getSuppliers } from "../api/suppliers.api";

export const useSuppliers = (params?: SupplierFilters) => {
  return useQuery({
    queryKey: ["suppliers", params],

    queryFn: () => getSuppliers(params),
  });
};
