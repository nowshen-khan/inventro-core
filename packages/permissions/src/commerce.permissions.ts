export const COMMERCE_PERMISSIONS = [
  // Sales
  "sale:view",
  "sale:create",

  // Purchases
  "purchase:view",
  "purchase:create",
  "purchase:delete",

  // Customers
  "customer:view",
  "customer:create",
  "customer:update",
  "customer:delete",
] as const;
