import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBrand } from "../api/brands.api";

export const useDeleteBrand = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteBrand,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["brands"],
      });
    },
  });
};
