import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { deleteSupplier } from "../api/suppliers.api";

export const useDeleteSupplier = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
};
