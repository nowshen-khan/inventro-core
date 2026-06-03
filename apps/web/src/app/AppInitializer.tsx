import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/stores/authStore";

export function AppInitializer() {
  useEffect(() => {
    useAuthStore.getState().fetchUser();
  }, []);

  return null;
}
