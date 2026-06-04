import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories.api";
import type { CategoryFilters } from "@repo/types/common";

export const useCategories = (params?: CategoryFilters) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  });
};
