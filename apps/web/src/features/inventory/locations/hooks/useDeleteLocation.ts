import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLocation } from "../api/locations.api";

export const useDeleteLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });
};
