import { useQuery } from "@tanstack/react-query";
import type { CustomerFilters } from "@repo/types/common";

import { getCustomers } from "../api/customers.api";

export const useCustomers = (params?: CustomerFilters) => {
  return useQuery({
    queryKey: ["customers", params],

    queryFn: () => getCustomers(params),
  });
};
