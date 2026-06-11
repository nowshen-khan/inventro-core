# Web Application

React + Vite frontend for the ERP system.

---

# Architecture

Frontend uses feature-based architecture.

```txt
features/
```

Each feature owns:

- pages
- api
- hooks
- components
- utils

---

# Domains

## Commerce

Sales, purchases, returns, exchanges, POS.

## Inventory

Stock, locations, transfers, adjustments.

## Catalog

Products, brands, categories, suppliers.

## IAM

Users and roles.

## CRM

Customers.

## Finance

Expenses and reports.

---

# Shared Layer

```txt
shared/
```

Contains reusable:

- UI components
- API client
- layout components
- tables
- common utilities

---

# Routing

Each feature can define its own:

```txt
routes.tsx
```

Main router aggregates all feature routes.

---

# State Management

- TanStack Query for server state
- Zustand for UI/client state

---

# UI

Built using:

- Tailwind CSS
- shadcn/ui

```

```
