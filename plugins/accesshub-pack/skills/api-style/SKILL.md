---
name: api-style
description: API style baseline for internal developer-platform services (Express + TypeScript) — layering, validation, error shape, status codes, naming. Use when designing or reviewing backend endpoints.
---

# API Style

For internal developer-platform services (Express + TypeScript).

- Layer the backend: thin routes → services (business logic) → repositories (DB access).
- Validate request bodies with a schema validator at the route boundary, once.
- Return every error as `{ error: { code, message, details } }` with a stable
  UPPER_SNAKE_CASE `code`.
- Use the right status codes: 200 read/action, 201 created, 400 validation, 401 no/unknown
  user, 403 not allowed, 404 not found, 409 conflict, 500 unhandled.
- camelCase JSON fields matching the data model.
- Never expose internal/sensitive fields (such as key hashes) in responses.
