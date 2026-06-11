# Shared Schemas Package

Shared Zod validation schemas for the ERP system.

---

# Purpose

This package centralizes validation logic shared between:

- frontend
- backend

Used for:

- form validation
- API validation
- reusable contracts

---

# Structure

```txt
src/
├── auth.schema.ts
├── branch.schema.ts
├── location.schema.ts
├── product.schema.ts
├── sale.schema.ts
├── purchase.schema.ts
├── transfer.schema.ts
├── expense.schema.ts
└── index.ts
```

---

# Rules

## One Domain Per File

Examples:

```txt
product.schema.ts
sale.schema.ts
```

Avoid giant schema files.

---

# Naming Rules

## Create Schema

```ts
createProductSchema;
createSaleSchema;
```

---

## Update Schema

```ts
updateProductSchema;
updateBranchSchema;
```

---

## Reusable Child Schemas

```ts
saleItemSchema;
purchaseItemSchema;
variantSchema;
```

---

# Shared Validation

Frontend forms and backend APIs should reuse the same schema whenever possible.

This reduces:

- duplicated validation
- inconsistent business rules
- frontend/backend mismatch

---

# Example Usage

```ts
import { createSaleSchema } from "@repo/schemas/sale";
```

---

# Goals

- centralized validation
- reusable schemas
- frontend/backend consistency
- scalable architecture

```

```
