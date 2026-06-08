---
name: api-error-standardization
description: Find and standardize inconsistent API error responses to a single { error: { code, message, details } } shape. Use when an endpoint returns an ad-hoc error body or when adding a new error path.
---

# API Error Standardization

Bring API errors to one standard shape.

## Target shape

```json
{ "error": { "code": "ERROR_CODE", "message": "Human readable message", "details": {} } }
```

## Steps

1. Search route handlers and middleware for responses that set a non-2xx status. Look
   for ad-hoc shapes: `{ message: ... }`, `{ error: "..." }` (a string), or bare strings.
2. Replace ad-hoc handling by throwing a shared error helper and letting a central error
   handler serialize it.
3. Choose a stable `code` (UPPER_SNAKE_CASE).
4. Add or update a test asserting `res.body.error.code` and the status.

## Anti-patterns

- Returning a string body or a `{ message }` object from a route.
- Duplicating not-found checks in the route when the service already throws.
