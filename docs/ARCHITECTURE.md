# Architecture

AccessHub is a two-app TypeScript monorepo managed with npm workspaces.

```
apps/web  ──HTTP──▶  apps/api  ──Prisma──▶  SQLite (prisma/dev.db)
```

## Frontend / backend split

- **apps/web** — React + Vite single-page app. One dashboard with tabbed panels
  (Services, Access Requests, API Keys, Usage, Audit Log) plus a service detail panel.
- **apps/api** — Express HTTP API. No server-side rendering; it returns JSON only.

During development Vite proxies `/api/*` to `http://localhost:4000` (see
`apps/web/vite.config.ts`).

## Backend layering

The backend follows a route → service → repository layering.

```
routes/        HTTP concerns: parse request, call a service, send response
  └─ services/     business logic and authorization decisions
       └─ repositories/   all database access (Prisma) lives here
```

- **Routes** (`apps/api/src/routes`) are meant to be thin. They read the request,
  call one service method, and serialize the result.
- **Services** (`apps/api/src/services`) hold the business rules: who may approve a
  request, when an audit event is written, how a key is issued, etc.
- **Repositories** (`apps/api/src/repositories`) are the only place that talks to
  Prisma. Services never import `prisma` directly (the database client lives in
  `apps/api/src/db.ts`).

> Note: the codebase does not follow these boundaries perfectly. Spotting and fixing
> the leaks (validation duplicated in routes, ad-hoc DB access in a route) is part of
> the workshop.

## Request identity

There is no real login. `apps/api/src/middleware/currentUser.ts` reads the
`x-user-id` header, loads that user, and attaches `req.currentUser`. Endpoints under
`/api` (except the public `/api/users` list) require it.

## Authorization

Authorization rules live in `apps/api/src/services/authz.service.ts` as the single
source of truth (`canManageService`, `canRevokeKey`, and their `assert*` variants).
Services should call these helpers. The frontend has its own *display-only* checks in
`apps/web/src/utils/permissions.ts` — these decide which buttons render and must never
be relied on for security.

## Validation

Request validation uses Zod schemas in `apps/api/src/validators`. The error handler
(`middleware/errorHandler.ts`) turns `ZodError` into the standard error shape.

## Error handling

All errors should flow through `apps/api/src/utils/errors.ts` (`AppError` + helpers)
and the central `errorHandler`, producing:

```json
{ "error": { "code": "SERVICE_NOT_FOUND", "message": "Service not found", "details": {} } }
```

See `docs/API_GUIDELINES.md`. Some endpoints currently return ad-hoc shapes — that is
a known issue.

## Database (Prisma + SQLite)

- Schema: `prisma/schema.prisma`. Models: `User`, `Team`, `Service`, `AccessRequest`,
  `ApiKey`, `UsageEvent`, `AuditLog`.
- The schema is applied with `prisma db push` (no migration files) and seeded with
  `prisma/seed.ts`.
- SQLite has no native JSON type, so `AuditLog.metadata` is a JSON-encoded string.

## Testing strategy

- **API**: Vitest + Supertest. A global setup (`src/tests/globalSetup.ts`) creates a
  fresh `prisma/test.db`, and each suite reseeds a small fixture set via
  `src/tests/helpers.ts`.
- **Web**: Vitest + Testing Library with a jsdom environment and a mocked `fetch`.
