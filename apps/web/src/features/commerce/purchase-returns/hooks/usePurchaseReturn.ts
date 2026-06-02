import { useQuery } from "@tanstack/react-query";

import { getPurchaseReturn } from "../api/purchaseReturns.api";

export const usePurchaseReturn = (id?: string) => {
  return useQuery({
    queryKey: ["purchase-return", id],

    queryFn: () => getPurchaseReturn(id!),

    enabled: !!id,
  });
};
