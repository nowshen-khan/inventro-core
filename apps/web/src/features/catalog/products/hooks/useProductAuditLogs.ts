import { useQuery } from "@tanstack/react-query";
import { getProductAuditLogs } from "../api/products.api";

export const useProductAuditLogs = (id?: string) =>
  useQuery({
    queryKey: ["product-audit-logs", id],
    queryFn: () => getProductAuditLogs(id!),
    enabled: !!id,
  });
