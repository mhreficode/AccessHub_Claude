---
description: Review the backend API for consistency and correctness.
argument-hint: [optional: route file or area]
allowed-tools: Read, Grep, Glob
model: inherit
---

Review the AccessHub backend API for consistency and correctness.
Scope (optional): $ARGUMENTS — if empty, review all of `apps/api/src/routes`.

1. Inspect the route handlers in `apps/api/src/routes`.
2. Compare error responses across endpoints. Flag any that do not use the standard
   shape `{ error: { code, message, details } }` from `apps/api/src/utils/errors.ts`.
3. Identify endpoints missing input validation, or validating in more than one place.
4. Identify authorization gaps — actions that are not enforced in the backend services
   or middleware (`apps/api/src/services/authz.service.ts`).
5. Propose small, reviewable fixes. Do not rewrite large areas.

For each finding, give: the file and line, why it matters, and the smallest fix.

> Tip: for a deeper architecture pass, hand the change to the `api-architect` subagent.
