import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrand } from "../api/brands.api";

export const useCreateBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
};
