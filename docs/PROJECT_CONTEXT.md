# AccessHub — Project Context

A curated, self-contained summary of AccessHub's product, domain, architecture, API, and
security context. It is imported into `CLAUDE.md` (via `@docs/PROJECT_CONTEXT.md`), so
Claude always has grounded context for this repo. It is also a good file to pull in with
`/context`, or to serve through the `accesshub-context` MCP server (see
`docs/MCP_EXERCISE.md`).

## Product

AccessHub is an internal developer platform and API catalog. Developers discover
internal services, read API docs, request access, receive API keys, monitor usage, and
review audit history. Service owners and platform admins manage access and services.

## User roles

- `developer` — view services, request access, view own keys and requests.
- `service_owner` — approve/reject requests and revoke keys for services their team owns.
- `platform_admin` — manage all services, view all requests and audit logs, revoke any key.

Identity is simplified: the frontend sends `x-user-id`; there is no real login.

## Domain rules (summary)

- Access requests need a reason (≥10 chars) and start `pending`.
- Only the owning team's owner or a platform admin may review a request.
- Approving issues an API key and writes an `access.approved` audit event.
- Rejecting must write an `access.rejected` audit event.
- Raw API keys are shown once; only prefix + SHA-256 hash are stored; keys must never
  be logged.
- Revoking a key writes `apikey.revoked`; a revoked key must not validate.
- Every access-lifecycle event is audited; audit data must not contain secrets.
- The audit log is visible to owners and admins only.

## Architecture (summary)

- Monorepo (npm workspaces): `apps/web` (React + Vite) and `apps/api` (Express + Prisma + SQLite).
- Backend layering: routes (thin) → services (business logic + authz) → repositories (Prisma).
- Authorization source of truth: `apps/api/src/services/authz.service.ts`.
- Validation: Zod schemas at the route boundary.

## API error format

```json
{ "error": { "code": "ERROR_CODE", "message": "Human readable message", "details": {} } }
```

## Security rules

- Never store or log raw API keys; store only prefix + hash.
- Enforce authorization on the backend; the frontend only hides controls.
- Sanitize rendered markdown.
- Keep secrets out of audit logs and the repo.

## Workshop feature scope — Expiring Service Access

Approved access expires 30 days after approval unless extended by an owner/admin.
Expired access invalidates related API keys. The dashboard shows access expiring soon.
Expiration and extension are audited. Not yet implemented — see `docs/PRD.md` and
`specs/access-expiration/`.

## Known conventions

- camelCase JSON fields matching Prisma models.
- Business logic in services, DB access in repositories, thin routes.
- New behavior comes with tests and a docs update.
