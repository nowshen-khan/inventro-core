import { useQuery } from "@tanstack/react-query";
import { getBranches } from "../api/branches.api";

export const useBranches = (params?: any) =>
  useQuery({
    queryKey: ["branches", params],
    queryFn: () => getBranches(params),
  });
