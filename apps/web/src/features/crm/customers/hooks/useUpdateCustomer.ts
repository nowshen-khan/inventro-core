import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer } from "../api/customers.api";
import type { UpdateCustomerPayload } from "@repo/types/common";

export const useUpdateCustomer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerPayload }) =>
      updateCustomer(id, data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};
