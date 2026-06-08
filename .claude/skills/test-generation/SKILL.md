---
name: test-generation
description: Testing style, scope, and examples for AccessHub (Vitest + Supertest backend, Vitest + Testing Library frontend). Use when adding or reviewing tests.
---

# Test Generation

How to write tests that fit AccessHub.

## Scope

- **Service logic** — business rules and authorization decisions.
- **API endpoints** — especially authorization-sensitive ones; assert status and
  `error.code` on failures.
- **Domain edge cases** — not-found, conflict, already-processed, revoked key, expired
  access.

## Backend style (Vitest + Supertest)

- Build the app with `createApp()` and drive it with Supertest.
- Reseed fixtures with `resetDb()` from `src/tests/helpers.ts` in `beforeEach`.
- Set the acting user with the `x-user-id` header.

```ts
const res = await request(app)
  .post('/api/access-requests/req-pending/approve')
  .set('x-user-id', 'u-omar');
expect(res.status).toBe(200);
```

## Frontend style (Vitest + Testing Library)

- Render components/`App` with a mocked `fetch`.
- Assert on visible text and on controls being present/absent by role/permission.

## Rules

- Add tests before the fix when reproducing a bug.
- Readable, behavior-focused names. No over-mocking. Never weaken a test to pass.
