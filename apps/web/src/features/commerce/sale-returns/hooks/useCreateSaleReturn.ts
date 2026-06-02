import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createSaleReturn } from "../api/saleReturns.api";

export const useCreateSaleReturn = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createSaleReturn,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["sale-returns"],
      });
    },
  });
};
