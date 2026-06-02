import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "../api/sales.api";

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};
