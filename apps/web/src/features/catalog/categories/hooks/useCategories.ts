import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories.api";

export const useCategories = (params?: any) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });
};
