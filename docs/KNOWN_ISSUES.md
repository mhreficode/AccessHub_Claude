# Known Issues

This repository intentionally contains defects so participants can practice fixing
real problems with Claude Code. **This list is deliberately incomplete** — some issues
are left undocumented for discovery exercises.

## 1. Inconsistent API error responses

Some endpoints return the standard shape:

```json
{ "error": { "code": "SERVICE_NOT_FOUND", "message": "Service not found", "details": {} } }
```

…while others return ad-hoc shapes like `{ "message": "Service not found" }` or
`{ "error": "API key not found" }`. Standardize them. Good for refactoring, CLAUDE.md
memory, and tests.

## 2. Frontend-only authorization on approve/reject

The UI hides the approve/reject buttons from developers, but the backend approve/reject
path does not fully verify that the reviewer owns the service's team. Tighten the
backend check (hint: `authz.service.ts` already has `assertCanManageService`). Add a
test for an owner of a *different* team being rejected.

## 3. Raw API key logged in development

A service function logs the raw API key when `NODE_ENV=development`. Find it and remove
it. `scripts/security-check.sh` can help.

## 4. Missing audit log on rejected access

Approving access writes an audit event; rejecting access does not. Add the missing
`access.rejected` event and a test for it.

## 5. Markdown documentation security risk

Service docs are rendered without sanitizing raw HTML
(`apps/web/src/utils/markdown.ts`). Make rendering safe.

## 6. Skipped tests for access expiration

`apps/api/src/tests/accessExpiration.skip.test.ts` defines the workshop feature's
behavior and is fully skipped. These become active as the feature is built.

---

A few more issues exist in the code and are **not** listed here on purpose. Try asking
Claude to review the backend and the API key handling to find them (the
`security-reviewer` and `api-architect` subagents are good for this).
