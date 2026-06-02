import { useQuery } from "@tanstack/react-query";
import { getStockAdjustment } from "../api/stock-adjustments.api";

export const useStockAdjustment = (id?: string) =>
  useQuery({
    queryKey: ["stock-adjustment", id],

    queryFn: () => getStockAdjustment(id!),

    enabled: !!id,
  });
