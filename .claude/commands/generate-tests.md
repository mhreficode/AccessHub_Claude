---
description: Add the tests that are missing for a given area of AccessHub.
argument-hint: [area, e.g. "api key revocation" or "reject flow"]
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npm run test:*)
model: inherit
---

Add the tests that are missing for this area of AccessHub: $ARGUMENTS

1. Inspect the implementation under test and the existing tests in
   `apps/api/src/tests` (or `apps/web/src/tests`).
2. Identify the missing cases — especially authorization edge cases, error paths, and
   domain rules (e.g. a revoked key must not validate; rejecting access must audit).
3. Add tests **before** changing production code, so a real gap fails first.
4. Keep test names readable and behavior-focused.
5. Avoid over-mocking; prefer the existing Supertest + fixture approach
   (`src/tests/helpers.ts`) on the backend.

Run the relevant suite and report pass/fail with the command you used.

> Tip: for a coverage audit first, ask the `test-engineer` subagent which tests matter most.
