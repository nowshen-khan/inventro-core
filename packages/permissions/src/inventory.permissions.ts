export const INVENTORY_PERMISSIONS = [
  // Transfers
  "transfer:view",
  "transfer:create",
  "transfer:approve",
  // Inventory
  "inventory:view",

  // Warehouses
  "warehouse:view",
  "warehouse:create",
  "warehouse:update",
  "warehouse:delete",
] as const;
