# Backend Modules

This directory contains all ERP business modules.

The backend follows a modular architecture.

---

# Main Domains

```txt
modules/
├── auth/
├── catalog/
├── commerce/
├── inventory/
├── finance/
├── iam/
├── reports/
└── settings/
```

---

# Standard Module Structure

```txt
module/
├── controller.ts
├── service.ts
├── repository.ts
├── schema.ts
├── routes.ts
├── types.ts
└── utils.ts
```

---

# Responsibilities

## controller.ts

Handles:

- HTTP requests
- responses
- request parsing

Controllers should remain thin.

---

# service.ts

Contains:

- business logic
- workflows
- validations
- transactions

Most logic should live here.

---

# repository.ts

Handles:

- Prisma queries
- database access

Avoid business logic here.

---

# schema.ts

Contains:

- Zod schemas
- request validation

---

# routes.ts

Registers Fastify routes and middleware.

---

# Rules

## Avoid Cross-Module Database Access

Prefer:

- services
- reusable shared logic

instead of directly querying another module’s tables.

---

# Inventory Rule

All stock movement should use:

```txt id="9vpdj4"
inventory/stock.service.ts
```

Avoid manual stock updates.

---

# Transaction Rule

Use Prisma transactions for:

- sales
- purchases
- transfers
- returns
- stock adjustments

---

# Goals

- scalable backend architecture
- maintainable modules
- isolated business domains
- reusable services

```

```
