# Backend Core Layer

This directory contains shared backend infrastructure.

Core is different from business modules.

---

# Purpose

The core layer contains:

- authentication
- authorization
- plugins
- middleware
- shared infrastructure
- global utilities

Business logic should not live here.

---

# Structure

```txt
core/
├── auth/
├── database/
├── errors/
├── middleware/
├── permissions/
├── plugins/
└── utils/
```

---

# Responsibilities

## auth/

JWT utilities, token handling, authentication helpers.

---

# database/

Prisma client and database configuration.

---

# middleware/

Reusable Fastify middleware.

Examples:

- authenticate
- authorize
- validate

---

# plugins/

Fastify plugins.

Examples:

- cookie
- cors
- helmet
- rate limit

---

# permissions/

Permission constants and helpers.

---

# errors/

Global error handling and custom error classes.

Examples:

- AppError
- validation errors
- authorization errors

---

# Rules

## Keep Core Generic

Avoid ERP-specific business logic here.

---

# Good Examples

```txt id="t70pjy"
JWT helper
API validation middleware
error formatter
```

---

# Bad Examples

```txt id="6yd34h"
sale processing
stock calculations
purchase logic
```

Those belong inside modules.

---

# Goals

- reusable infrastructure
- clean backend foundation
- separation of concerns
- scalable architecture

```

```
