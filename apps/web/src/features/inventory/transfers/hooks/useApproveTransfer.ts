import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransferStatus } from "@repo/types/enums";
import { approveTransfer, updateTransferStatus } from "../api/transfers.api";

export const useApproveTransfer = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: approveTransfer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
};

export const useUpdateTransferStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TransferStatus }) =>
      updateTransferStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transfers"] });
      qc.invalidateQueries({ queryKey: ["transfer"] });
      qc.invalidateQueries({ queryKey: ["transfer-report"] });
      qc.invalidateQueries({ queryKey: ["transfer-audit-logs"] });
    },
  });
};
