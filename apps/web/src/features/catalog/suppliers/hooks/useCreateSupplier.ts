import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createSupplier } from "../api/suppliers.api";

export const useCreateSupplier = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createSupplier,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
};
