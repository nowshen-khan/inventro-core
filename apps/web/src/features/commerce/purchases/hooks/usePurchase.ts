import { useQuery } from "@tanstack/react-query";
import { getPurchase } from "../api/purchases.api";

export const usePurchase = (id?: string) => {
  return useQuery({
    queryKey: ["purchase", id],

    queryFn: () => getPurchase(id!),

    enabled: !!id,
  });
};
