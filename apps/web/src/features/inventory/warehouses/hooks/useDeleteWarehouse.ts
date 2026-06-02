import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWarehouse } from "../api/warehouses.api";

export const useDeleteWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  });
};
