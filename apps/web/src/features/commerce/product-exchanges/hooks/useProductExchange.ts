import { useQuery } from "@tanstack/react-query";

import { getProductExchange } from "../api/productExchanges.api";

export const useProductExchange = (id?: string) => {
  return useQuery({
    queryKey: ["product-exchange", id],

    queryFn: () => getProductExchange(id!),

    enabled: !!id,
  });
};
