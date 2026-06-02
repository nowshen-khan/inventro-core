import { useQuery } from "@tanstack/react-query";
import { getSaleReturn } from "../api/saleReturns.api";

export const useSaleReturn = (id?: string) => {
  return useQuery({
    queryKey: ["sale-return", id],

    queryFn: () => getSaleReturn(id!),

    enabled: !!id,
  });
};
