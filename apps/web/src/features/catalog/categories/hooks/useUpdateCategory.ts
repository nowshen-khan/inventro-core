import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCategory } from "../api/categories.api";

export const useUpdateCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCategory(id, data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};
