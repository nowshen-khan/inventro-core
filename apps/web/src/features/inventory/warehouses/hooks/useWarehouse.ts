import { useQuery } from "@tanstack/react-query";
import { getWarehouse } from "../api/warehouses.api";

export const useWarehouse = (id: string) =>
  useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => getWarehouse(id),
    enabled: !!id,
  });
