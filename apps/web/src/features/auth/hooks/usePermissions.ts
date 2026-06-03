import { useQuery } from "@tanstack/react-query";
import { getMyPermissions } from "@/features/auth/api/auth.api";
import api from "@/shared/api/client.api";

export const usePermissions = () => {
  return useQuery({
    queryKey: ["myPermissions"],
    queryFn: async () => {
      const res = await api.get("/auth/permissions");

      return res.data.permissions.map((p: any) => p.permission.action);
      // getMyPermissions,
      // staleTime: 5 * 60 * 1000, // 5 min
    },
  });
};
