import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { createProductExchange } from "../api/productExchanges.api";

export const useCreateProductExchange = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createProductExchange,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["product-exchanges"],
      });
    },
  });
};
