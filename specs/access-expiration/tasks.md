# Tasks: Expiring Service Access

> Status: DRAFT — implement top to bottom. Keep each task small and tested.

- [ ] Add expiration fields to the `AccessRequest` model (`expiresAt`, `extendedAt`, `extendedById`)
- [ ] Apply the schema (`npm run db:push`) and reseed
- [ ] Set `expiresAt` when an access request is approved
- [ ] Add a service function to determine the expiration state of access
- [ ] Update API key validation to reject keys tied to expired access
- [ ] Add `GET /api/access/expiring` to list access expiring soon
- [ ] Add `POST /api/access-requests/:id/extend` (owners / admins only)
- [ ] Add audit events for expiration and extension
- [ ] Add a dashboard "expiring soon" indicator
- [ ] Un-skip and implement the backend tests in `accessExpiration.skip.test.ts`
- [ ] Add a frontend test for the expiring-access indicator
- [ ] Update docs (DOMAIN_RULES, API_GUIDELINES, SECURITY)
