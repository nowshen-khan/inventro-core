import { useQuery } from "@tanstack/react-query";
import { getMyPermissions } from "@/features/auth/api/auth.api";

export const usePermissions = () => {
  return useQuery({
    queryKey: ["myPermissions"],
    queryFn: getMyPermissions,
    staleTime: 5 * 60 * 1000, // 5 min
  });
};
