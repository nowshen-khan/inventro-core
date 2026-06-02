import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole, updateRole, deleteRole } from "../api/roles.api";

export const useCreateRole = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateRole(id, data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
};
