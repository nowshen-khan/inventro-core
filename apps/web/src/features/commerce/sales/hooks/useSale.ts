import { useQuery } from "@tanstack/react-query";
import { getSale } from "../api/sales.api";

export const useSale = (id?: string) => {
  return useQuery({
    queryKey: ["sale", id],

    queryFn: () => getSale(id!),

    enabled: !!id,
  });
};
