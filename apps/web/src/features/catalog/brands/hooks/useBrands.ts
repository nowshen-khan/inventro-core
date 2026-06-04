import { useQuery } from "@tanstack/react-query";

import { getBrands } from "../api/brands.api";
import type { BrandFilters } from "@repo/types/common";

export const useBrands = (params?: BrandFilters) => {
  return useQuery({
    queryKey: ["brands", params],
    queryFn: () => getBrands(params),
  });
};
