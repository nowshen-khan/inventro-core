import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWarehouse } from "../api/warehouses.api";

export const useCreateWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  });
};
