import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "../api/customers.api";

export const useDeleteCustomer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};
