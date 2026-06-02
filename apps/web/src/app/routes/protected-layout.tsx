import MainLayout from "@/layouts/MainLayout";

import { ProtectedRoute } from "./protected-route";

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );
}
