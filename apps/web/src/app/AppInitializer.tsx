import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/stores/authStore";

export function AppInitializer() {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return null;
}
