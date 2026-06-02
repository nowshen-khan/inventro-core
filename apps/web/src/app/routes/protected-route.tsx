import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/features/auth/stores/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  const isInitialized = useAuthStore((s) => s.isInitialized);

  // wait for auth check
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
