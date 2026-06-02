import { useEffect } from "react";

import { RouterProvider } from "react-router-dom";

import { router } from "@/app/routes/index";

import { useAuthStore } from "@/features/auth/stores/authStore";

export default function App() {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, []);

  return <RouterProvider router={router} />;
}
