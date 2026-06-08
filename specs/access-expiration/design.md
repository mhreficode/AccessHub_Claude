# Design: Expiring Service Access

> Status: DRAFT — options listed, final decisions left open on purpose.

## Data model

Add to `AccessRequest` (in `prisma/schema.prisma`):

```prisma
expiresAt    DateTime?
extendedAt   DateTime?
extendedById String?
```

<!-- TODO: should expiry live on AccessRequest, or in a separate Access/Grant model? -->

Apply with `prisma db push` (this repo does not use migration files).

## Evaluation strategy (choose one)

- **Lazy:** compute "expired" on read and on key validation. No scheduler.
  - Pro: simple, no background process. Con: status only updates when something reads it.
- **Scheduled:** a job flips status and revokes keys when expiry passes.
  - Pro: dashboard/audit reflect reality without a read. Con: needs a runner.

<!-- TODO: pick one and justify it. Lazy is likely enough for the workshop. -->

## Service changes

- `accessRequest.service.ts`
  - On `approve`: set `expiresAt = now + ACCESS_TTL_DAYS` (see `utils/dates.ts`).
  - New `extend(currentUser, requestId)`: authz via `authz.service`, update expiry,
    write `access.extended` audit event.
  - New `isExpired(request)` / `expiringSoon(...)` helpers (or reuse `utils/dates.ts`).
- `apiKey.service.ts`
  - `validateKey`: also reject keys whose access has expired.

## API changes

- `GET /api/access/expiring` — list access expiring within N days.
- `POST /api/access-requests/:id/extend` — owners/admins only.

## Frontend changes

- Show an "expiring soon" indicator on the Access Requests tab (and/or a dedicated view).
- Add an "Extend" action for owners/admins.

## Testing

Un-skip and implement `apps/api/src/tests/accessExpiration.skip.test.ts`, plus a
frontend test for the indicator.

## Docs

Update `docs/DOMAIN_RULES.md`, `docs/API_GUIDELINES.md`, `docs/SECURITY.md`.
