export const INVENTORY_PERMISSIONS = [
  // Transfers
  "transfer:view",
  "transfer:create",
  "transfer:approve",
  "transfer:reject",
  "transfer:complete",
  "transfer:cancel",
  "transfer:export",
  "transfer:report",
  "transfer:audit",
  // Inventory
  "inventory:view",

  // Locations
  "location:view",
  "location:create",
  "location:update",
  "location:delete",
] as const;
