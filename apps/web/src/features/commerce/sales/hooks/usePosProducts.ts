import { useQuery } from "@tanstack/react-query";
import { searchPosProducts } from "../api/pos.api";

export const usePosProducts = (search: string) => {
  return useQuery({
    queryKey: ["pos-products", search],

    queryFn: () => searchPosProducts(search),

    enabled: search.length >= 2,
  });
};
