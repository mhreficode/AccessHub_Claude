---
name: api-error-standardization
description: Find and standardize inconsistent API error responses in AccessHub to the single { error: { code, message, details } } shape. Use when an endpoint returns an ad-hoc error body or when adding a new error path.
---

# API Error Standardization

How to bring AccessHub API errors to the single standard shape.

## Target shape

```json
{ "error": { "code": "ERROR_CODE", "message": "Human readable message", "details": {} } }
```

## Steps

1. Search `apps/api/src/routes` and `apps/api/src/middleware` for responses that set a
   non-2xx status. Look for ad-hoc shapes: `{ message: ... }`, `{ error: "..." }` (a
   string), or bare strings.
2. Replace ad-hoc handling by **throwing** an `AppError` helper from
   `apps/api/src/utils/errors.ts` (`badRequest`, `unauthorized`, `forbidden`,
   `notFound`, `conflict`) and letting the central `errorHandler` serialize it.
3. Choose a stable `code` (UPPER_SNAKE_CASE). Add it to the `ErrorCode` union if new.
4. Update or add a test asserting `res.body.error.code` and the status.
5. Update `docs/API_GUIDELINES.md` if you introduce a new code.

## Anti-patterns

- Returning a string body or a `{ message }` object from a route.
- Duplicating not-found checks in the route when the service already throws.
