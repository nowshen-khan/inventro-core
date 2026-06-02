import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { updateSupplier } from "../api/suppliers.api";

export const useUpdateSupplier = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;

      data: any;
    }) => updateSupplier(id, data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["suppliers"],
      });
    },
  });
};
