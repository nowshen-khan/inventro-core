# API Application

Fastify + Prisma backend for the ERP system.

---

# Architecture

The backend uses a modular architecture.

Each module contains:

```txt
module/
├── controller.ts
├── service.ts
├── repository.ts
├── schema.ts
└── routes.ts
```

---

# Responsibilities

## controller.ts

Handles HTTP requests and responses.

## service.ts

Contains business logic.

## repository.ts

Handles database queries.

## schema.ts

Contains Zod validation schemas.

## routes.ts

Registers Fastify routes.

---

# Core Layer

```txt
core/
├── auth/
├── database/
├── middleware/
├── plugins/
├── permissions/
└── errors/
```

Shared backend infrastructure lives here.

---

# Inventory Logic

Stock updates are centralized in:

```txt
inventory/stock.service.ts
```

All purchase, sale, transfer, and adjustment modules should use this service.

---

# Important Rules

- Keep business logic inside services
- Keep database logic inside repositories
- Avoid cross-module direct database access
- Reuse stock service for stock movement
- Validate requests using Zod schemas

```

```
