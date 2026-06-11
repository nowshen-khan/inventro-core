import { useQuery } from "@tanstack/react-query";
import type { TransferFilters } from "@repo/types/transfers";
import { getTransfers } from "../api/transfers.api";

export const useTransfers = (params?: TransferFilters) =>
  useQuery({
    queryKey: ["transfers", params],
    queryFn: () => getTransfers(params),
  });
