# Shared Types Package

Shared TypeScript types for the ERP system.

---

# Purpose

This package centralizes:

- entity types
- payload types
- filter types
- shared enums
- API response types

Used by:

- frontend
- backend
- future mobile apps

---

# Structure

```txt
src/
├── auth.ts
├── common.ts
├── inventory.ts
├── product.ts
├── sales.ts
├── purchases.ts
├── transfers.ts
├── enums.ts
└── index.ts
```

---

# Guidelines

## Keep Types Pure

Avoid:

- business logic
- utility functions
- API calls

Only store TypeScript types/interfaces.

---

# Naming Rules

## Entities

```ts
Product;
Sale;
Warehouse;
```

---

## Payloads

```ts
CreateSalePayload;
UpdateProductPayload;
```

---

## Filters

```ts
ProductFilters;
CustomerFilters;
```

---

# Import Style

Preferred:

```ts
import type { Product } from "@repo/types/product";
```

Or:

```ts
import type { Product } from "@repo/types";
```

---

# Goals

- type safety
- frontend/backend consistency
- shared contracts
- scalable monorepo architecture

```

```
