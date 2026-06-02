import { useQuery } from "@tanstack/react-query";

import { getPurchaseReturns } from "../api/purchaseReturns.api";

export const usePurchaseReturns = (filters?: any) => {
  return useQuery({
    queryKey: ["purchase-returns", filters],

    queryFn: () => getPurchaseReturns(filters),
  });
};
