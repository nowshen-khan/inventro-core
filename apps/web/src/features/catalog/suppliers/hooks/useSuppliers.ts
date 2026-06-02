import { useQuery } from "@tanstack/react-query";

import { getSuppliers } from "../api/suppliers.api";

export const useSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"],

    queryFn: getSuppliers,
  });
};
