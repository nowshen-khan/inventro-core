import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProduct } from "../api/products.api";

export const useDeleteProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
