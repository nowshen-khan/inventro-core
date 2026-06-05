import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWarehouse } from "../api/warehouses.api";
import type { UpdateWarehouseDto } from "@repo/types";

export const useUpdateWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseDto }) =>
      updateWarehouse(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["warehouses"] }),
  });
};
