import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStockAdjustment } from "../api/stock-adjustments.api";

export const useCreateStockAdjustment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createStockAdjustment,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["stock-adjustments"],
      });
    },
  });
};
