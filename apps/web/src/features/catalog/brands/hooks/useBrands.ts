import { useQuery } from "@tanstack/react-query";

import { getBrands } from "../api/brands.api";

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],

    queryFn: getBrands,
  });
};
