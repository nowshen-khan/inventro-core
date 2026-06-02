import { useQuery } from "@tanstack/react-query";
import { getTransfer } from "../api/transfers.api";

export const useTransfer = (id?: string) =>
  useQuery({
    queryKey: ["transfer", id],

    queryFn: () => getTransfer(id!),

    enabled: !!id,
  });
