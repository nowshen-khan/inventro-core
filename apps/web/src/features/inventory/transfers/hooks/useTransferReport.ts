import { useQuery } from "@tanstack/react-query";
import type { TransferFilters } from "@repo/types/transfers";
import { getTransferReport } from "../api/transfers.api";

export const useTransferReport = (params?: TransferFilters) =>
  useQuery({
    queryKey: ["transfer-report", params],
    queryFn: () => getTransferReport(params),
  });
