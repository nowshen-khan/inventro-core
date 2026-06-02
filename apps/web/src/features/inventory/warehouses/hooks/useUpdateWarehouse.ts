import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWarehouse } from "../api/warehouses.api";

export const useUpdateWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateWarehouse(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  });
};
