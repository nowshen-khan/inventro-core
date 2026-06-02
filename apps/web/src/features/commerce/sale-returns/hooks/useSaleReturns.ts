import { useQuery } from "@tanstack/react-query";
import { getSaleReturns } from "../api/saleReturns.api";

export const useSaleReturns = () => {
  return useQuery({
    queryKey: ["sale-returns"],

    queryFn: () => getSaleReturns(),
  });
};
