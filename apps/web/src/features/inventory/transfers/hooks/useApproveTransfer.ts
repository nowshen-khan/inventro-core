import { useMutation, useQueryClient } from "@tanstack/react-query";

import { approveTransfer } from "../api/transfers.api";

export const useApproveTransfer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: approveTransfer,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["transfers"],
      });
    },
  });
};
