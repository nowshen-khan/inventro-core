import { useQuery } from "@tanstack/react-query";
import { getTransferAuditLogs } from "../api/transfers.api";

export const useTransferAuditLogs = (id?: string) =>
  useQuery({
    queryKey: ["transfer-audit-logs", id],
    queryFn: () => getTransferAuditLogs(id!),
    enabled: !!id,
  });
