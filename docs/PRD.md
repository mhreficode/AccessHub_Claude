# AccessHub Workshop PRD

This is the workshop backlog. The main feature is **Expiring Service Access**. The
autonomous-loop exercise reads the unchecked items below one at a time.

## Main Feature: Expiring Service Access

Approved access to a service should expire after 30 days unless a service owner or
platform admin extends it. Expired access invalidates the related API keys.

- [ ] Add expiration fields to the access model (`expiresAt`, `extendedAt`, `extendedById`)
- [ ] Set `expiresAt` (approval time + 30 days) when a request is approved
- [ ] Add a service function to compute whether access is expired
- [ ] Reject API keys tied to expired access in `apiKeyService.validateKey`
- [ ] Add `GET /api/access/expiring` to list access expiring soon
- [ ] Show expiring access on the dashboard
- [ ] Add `POST /api/access-requests/:id/extend` (owners / admins only)
- [ ] Write `access.expired` and `access.extended` audit events
- [ ] Add backend tests (un-skip `accessExpiration.skip.test.ts`)
- [ ] Add a frontend test for the expiring-access indicator
- [ ] Update `docs/DOMAIN_RULES.md`, `docs/API_GUIDELINES.md`, and `docs/SECURITY.md`

## Supporting backlog (intentional issues)

These are smaller fixes participants can pick up. See `docs/KNOWN_ISSUES.md`.

- [ ] Standardize all API error responses to `{ error: { code, message, details } }`
- [ ] Enforce service ownership in the backend approve/reject path
- [ ] Remove the dev-mode raw API key log
- [ ] Write an audit event when access is rejected
- [ ] De-duplicate the access-reason validation (route vs service)
- [ ] Replace the in-memory usage aggregation with a grouped query
- [ ] Add a test that a revoked key is rejected
- [ ] Fix the outdated endpoint path in the Identity API docs
- [ ] Sanitize rendered service-doc markdown
