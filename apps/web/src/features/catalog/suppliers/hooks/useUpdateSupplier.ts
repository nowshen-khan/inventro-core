import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupplier } from "../api/suppliers.api";
import type { UpdateSupplierDto } from "@repo/types/supplier";

export const useUpdateSupplier = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;

      data: UpdateSupplierDto;
    }) => updateSupplier(id, data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
};
