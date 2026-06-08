export const INVENTORY_PERMISSIONS = [
  // Transfers
  "transfer:view",
  "transfer:create",
  "transfer:approve",
  // Inventory
  "inventory:view",

  // Locations
  "location:view",
  "location:create",
  "location:update",
  "location:delete",
] as const;
