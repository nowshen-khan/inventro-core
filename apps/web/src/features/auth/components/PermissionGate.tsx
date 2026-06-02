import type { ReactNode } from "react";
import type { Permission } from "@repo/permissions";
import { usePermissions } from "../hooks/usePermissions";

export function PermissionGate({
  required,
  children,
  fallback = null,
}: {
  required: Permission | Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { data: permissions } = usePermissions();

  if (!permissions) return fallback;

  const requiredPermissions = Array.isArray(required) ? required : [required];

  const allowed = requiredPermissions.every((p) => permissions.includes(p));

  return allowed ? children : fallback;
}
