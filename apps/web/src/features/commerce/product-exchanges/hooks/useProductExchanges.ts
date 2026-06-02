import { useQuery } from "@tanstack/react-query";

import { getProductExchanges } from "../api/productExchanges.api";

export const useProductExchanges = () => {
  return useQuery({
    queryKey: ["product-exchanges"],

    queryFn: () => getProductExchanges(),
  });
};
