import UsersPage from "@/features/iam/users/pages/UsersPage";
import RolesPage from "@/features/iam/roles/pages/RolesPage";

export const settingsRoutes = [
  { path: "users", element: <UsersPage /> },
  { path: "roles", element: <RolesPage /> },
];
