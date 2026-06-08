import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLocation } from "../api/locations.api";
import type { UpdateLocationDto } from "@repo/types/location";

export const useUpdateLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocationDto }) =>
      updateLocation(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["locations"] }),
  });
};
