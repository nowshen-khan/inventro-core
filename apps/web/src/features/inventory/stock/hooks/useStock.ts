import { useQuery } from "@tanstack/react-query";
import { getStock } from "../api/stock.api";

export const useStock = (params?: any) =>
  useQuery({
    queryKey: ["stock", params],
    queryFn: () => getStock(params),
  });
