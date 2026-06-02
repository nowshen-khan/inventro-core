import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createPurchase } from "../api/purchases.api";

export const useCreatePurchase = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createPurchase,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["purchases"],
      });
    },
  });
};
