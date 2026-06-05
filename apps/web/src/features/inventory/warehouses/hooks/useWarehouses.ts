import { useQuery } from "@tanstack/react-query";
import { getWarehouses } from "../api/warehouses.api";
import type { WarehouseFilters } from "@repo/types/warehouse";

export const useWarehouses = (params?: WarehouseFilters) =>
  useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => getWarehouses(params),
  });
