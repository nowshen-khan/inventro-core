import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { createPurchaseReturn } from "../api/purchaseReturns.api";

export const useCreatePurchaseReturn = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseReturn,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["purchase-returns"],
      });

      qc.invalidateQueries({
        queryKey: ["inventory"],
      });

      qc.invalidateQueries({
        queryKey: ["purchases"],
      });
    },
  });
};
