# Inventory ERP Monorepo

Modern full-stack ERP system built with Turborepo, Fastify, Prisma, React, and TypeScript.

---

# Tech Stack

## Frontend

- React
- Vite
- TypeScript
- TanStack Query
- React Router
- Tailwind CSS
- shadcn/ui
- Zustand

## Backend

- Fastify
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

## Monorepo

- Turborepo
- pnpm workspaces

---

# Project Structure

```txt
apps/
 ├── api/      # Fastify backend
 └── web/      # React frontend

packages/
 ├── types/            # Shared TypeScript types
 ├── schemas/          # Shared Zod schemas
 ├── ui/               # Shared UI package
 ├── eslint-config/    # Shared ESLint config
 └── typescript-config # Shared TS configs
```

---

# Main Domains

## Commerce

- Sales
- Sale Returns
- Purchases
- Purchase Returns
- Product Exchanges
- POS

## Inventory

- Stock
- Transfers
- Location
- Stock Adjustments

## Catalog

- Products
- Categories
- Brands
- Suppliers

## CRM

- Customers

## IAM

- Users
- Roles
- Permissions

## Finance

- Expenses

---

# Backend Architecture

Each backend module follows:

```txt
module/
├── controller.ts
├── service.ts
├── repository.ts
├── schema.ts
└── routes.ts
```

---

# Frontend Architecture

Each frontend feature follows:

```txt
feature/
├── api/
├── hooks/
├── components/
├── pages/
├── schemas/
├── utils/
└── routes.tsx
```

---

# Development

## Install dependencies

```bash
pnpm install
```

## Run frontend

```bash
pnpm --filter web dev
```

## Run backend

```bash
pnpm --filter api dev
```

## Run all apps

```bash
pnpm dev
```

---

# Database

## Generate Prisma Client

```bash
pnpm --filter api prisma generate
```

## Run migrations

```bash
pnpm --filter api prisma migrate dev
```

## Seed database

```bash
pnpm --filter api prisma db seed
```

---

# Goals

- Scalable ERP architecture
- Feature-based frontend
- Modular backend
- Shared schemas and types
- Clean domain separation
- Easy long-term maintenance
