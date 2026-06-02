import { useQuery } from "@tanstack/react-query";
import { getStockAdjustments } from "../api/stock-adjustments.api";

export const useStockAdjustments = () =>
  useQuery({
    queryKey: ["stock-adjustments"],

    queryFn: () => getStockAdjustments(),
  });
