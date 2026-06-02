import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../api/purchases.api";

export const usePurchases = (filters?: any) => {
  return useQuery({
    queryKey: ["purchases", filters],

    queryFn: () => getPurchases(filters),
  });
};
