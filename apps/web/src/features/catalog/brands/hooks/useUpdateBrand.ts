import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateBrand } from "../api/brands.api";

export const useUpdateBrand = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateBrand(id, data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["brands"],
      });
    },
  });
};
