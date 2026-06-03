import { Navigate } from "react-router-dom";

import { usePermissions } from "../hooks/usePermissions";

export function PermissionRoute({
  permission,
  children,
}: {
  permission: string;

  children: React.ReactNode;
}) {
  const { data: permissions } = usePermissions();

  if (!permissions) {
    return null;
  }

  if (!permissions.includes(permission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
