import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "../api/products.api";

export const useUpdateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateProduct(id, data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
