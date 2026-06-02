import { useQuery } from "@tanstack/react-query";

import { getTransfers } from "../api/transfers.api";

export const useTransfers = (params?: any) =>
  useQuery({
    queryKey: ["transfers", params],

    queryFn: () => getTransfers(params),
  });
