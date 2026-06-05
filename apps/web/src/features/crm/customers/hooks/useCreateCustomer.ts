import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "../api/customers.api";

export const useCreateCustomer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};
