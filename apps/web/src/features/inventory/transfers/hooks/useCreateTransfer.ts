import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "../api/transfers.api";

export const useCreateTransfer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["transfers"],
      });
      qc.invalidateQueries({
        queryKey: ["transfer-report"],
      });
    },
  });
};
