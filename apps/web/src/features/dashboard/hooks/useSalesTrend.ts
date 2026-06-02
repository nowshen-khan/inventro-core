import { useQuery } from "@tanstack/react-query";

import { getSalesTrend } from "../api/dashboard.api";

export const useSalesTrend = () => {
  return useQuery({
    queryKey: ["sales-trend"],

    queryFn: () => getSalesTrend(),
  });
};
