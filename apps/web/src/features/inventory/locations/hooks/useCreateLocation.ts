import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLocation } from "../api/locations.api";

export const useCreateLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });
};
