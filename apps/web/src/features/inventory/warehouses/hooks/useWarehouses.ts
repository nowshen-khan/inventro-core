import { useQuery } from "@tanstack/react-query";
import { getWarehouses } from "../api/warehouses.api";

export const useWarehouses = (params?: any) =>
  useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => getWarehouses(params),
  });
