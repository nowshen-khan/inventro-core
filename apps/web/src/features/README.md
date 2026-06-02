# Frontend Features Architecture

This directory contains all business features of the ERP system.

The frontend follows a feature-based architecture.

---

# Main Domains

```txt
features/
├── auth/
├── dashboard/
├── catalog/
├── commerce/
├── inventory/
├── crm/
├── iam/
├── finance/
├── reports/
└── settings/
```

---

# Feature Rules

Each feature owns:

- pages
- components
- api
- hooks
- validation
- business utilities

Avoid placing feature-specific code inside shared folders.

---

# Standard Feature Structure

```txt
feature/
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── store/
├── types/
├── utils/
├── constants.ts
├── routes.tsx
└── index.ts
```

---

# Naming Conventions

## Pages

Use:

```txt
ProductsPage.tsx
SaleDetailsPage.tsx
```

Avoid:

```txt
Products.tsx
Details.tsx
```

---

## APIs

Use:

```txt
products.api.ts
sales.api.ts
```

---

## Hooks

Use:

```txt
useProducts.ts
useCreateSale.ts
```

---

## Routes

Each feature may define:

```txt
routes.tsx
```

The app router aggregates feature routes.

---

# Shared Layer

Use:

```txt
shared/
```

only for globally reusable code.

Examples:

- DataTable
- Modal
- PageHeader
- API client
- reusable hooks

Do not move feature business logic into shared.

```

```
