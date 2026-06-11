import { INVENTORY_PERMISSIONS } from "./inventory.permissions";
import { CATALOG_PERMISSIONS } from "./catalog.permissions";
import { COMMERCE_PERMISSIONS } from "./commerce.permissions";
import { FINANCE_PERMISSIONS } from "./finance.permissions";
import { IAM_PERMISSIONS } from "./iam.permissions";
import { REPORT_PERMISSIONS } from "./report.permissions";
import { DASHBOARD_PERMISSIONS } from "./dashboard.permissions";

export const ALL_PERMISSIONS = [
  ...INVENTORY_PERMISSIONS,
  ...CATALOG_PERMISSIONS,
  ...COMMERCE_PERMISSIONS,
  ...FINANCE_PERMISSIONS,
  ...IAM_PERMISSIONS,
  ...REPORT_PERMISSIONS,
  ...DASHBOARD_PERMISSIONS,
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];
