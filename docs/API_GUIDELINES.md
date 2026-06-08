# API Guidelines

Conventions for the AccessHub backend (`apps/api`).

## REST conventions

- Resources are plural nouns: `/api/services`, `/api/access-requests`, `/api/api-keys`.
- State transitions that are not plain CRUD use a verb sub-path:
  `POST /api/access-requests/:id/approve`, `POST /api/api-keys/:id/revoke`.
- Use the right method: `GET` to read, `POST` to create or trigger an action,
  `PATCH` to partially update.

## Endpoints

```
GET    /api/health
GET    /api/users                          (public — for the user switcher)
GET    /api/me
GET    /api/services
GET    /api/services/:id
PATCH  /api/services/:id
POST   /api/services/:id/access-requests
GET    /api/access-requests
POST   /api/access-requests/:id/approve
POST   /api/access-requests/:id/reject
GET    /api/api-keys
POST   /api/api-keys/:id/revoke
GET    /api/usage/summary
GET    /api/audit-log
```

Workshop (not implemented):

```
GET    /api/access/expiring
POST   /api/access-requests/:id/extend
```

## Error response format

**Every** error must use this shape:

```json
{
  "error": {
    "code": "SERVICE_NOT_FOUND",
    "message": "Service not found",
    "details": {}
  }
}
```

- `code` is a stable, UPPER_SNAKE_CASE machine code.
- `message` is a human-readable sentence.
- `details` is an object (may be empty); use it for validation issues.

Produce errors by throwing the helpers in `apps/api/src/utils/errors.ts`
(`badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflict`). The central
error handler serializes them.

> Known issue: a few endpoints still return ad-hoc shapes such as `{ "message": "..." }`
> or `{ "error": "..." }`. Standardizing them is a workshop task.

## Status codes

| Code | When |
|------|------|
| 200 | Successful read or action |
| 201 | Resource created (e.g. a new access request) |
| 400 | Validation / bad input (`BAD_REQUEST`, `VALIDATION_ERROR`) |
| 401 | No / unknown user (`UNAUTHORIZED`) |
| 403 | Authenticated but not allowed (`FORBIDDEN`) |
| 404 | Resource not found |
| 409 | Conflict (e.g. approving an already-approved request) |
| 500 | Unhandled error (`INTERNAL_ERROR`) |

## Validation

- Validate request bodies with Zod schemas in `apps/api/src/validators`.
- Validate once, at the route boundary. Do not duplicate the same checks in the
  service layer (a known smell in the current code).

## Naming

- camelCase for JSON fields, matching the Prisma model fields.
- Never expose `keyHash`. API key responses include only a masked prefix.
