import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import api from "@/shared/api/client.api";

export const useImportProducts = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file);

      const res = await api.post("/products/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
