# Shared Frontend Layer

This directory contains globally reusable frontend code.

---

# Purpose

The shared layer is used for:

- reusable UI
- reusable hooks
- reusable utilities
- reusable layouts
- reusable tables
- reusable API infrastructure

Avoid placing feature-specific business logic here.

---

# Structure

```txt
shared/
├── api/
├── components/
├── config/
├── constants/
├── hooks/
├── lib/
├── tables/
├── types/
└── utils/
```

---

# Rules

## Shared Means Truly Shared

Only place code here if it is reused across multiple features.

---

# Good Examples

```txt id="mvm54q"
DataTable
Modal
PageHeader
query client
pagination hook
```

---

# Bad Examples

```txt id="7x3ll0"
SaleSummary
TransferForm
ProductExchangeTable
```

Those belong inside features.

---

# API Layer

```txt
shared/api/
```

Contains:

- axios client
- query client
- common API helpers
- API error handling

---

# Components

```txt
shared/components/
```

Contains reusable UI and layout components.

Examples:

- DataTable
- ConfirmDialog
- EmptyState
- PageContainer

---

# Hooks

```txt
shared/hooks/
```

Contains generic reusable hooks.

Examples:

- useDebounce
- usePagination
- useLocalStorage

---

# Constants

```txt
shared/constants/
```

Contains:

- statuses
- permissions
- payment methods
- app constants

---

# Goals

- reduce duplication
- improve consistency
- simplify maintenance
- keep features isolated

```

```
