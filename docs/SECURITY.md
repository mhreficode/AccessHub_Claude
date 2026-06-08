# Security

Security rules for AccessHub. These are also the focus of several workshop exercises.

## API keys

- **Never store raw API keys.** Store only a `keyPrefix` and a SHA-256 `keyHash`
  (`apps/api/src/utils/crypto.ts`).
- **Never log raw API keys.** Not in `console.log`, not in audit logs, not anywhere.
- The raw key is returned to the requester **exactly once**, at creation, and never
  again.
- Never expose `keyHash` in an API response. Responses use a masked prefix only.

> Known issue: one code path logs a raw key in development mode. Finding and removing
> it is a workshop exercise (see `docs/KNOWN_ISSUES.md` and `scripts/security-check.sh`).

## Authorization

- Authorization must be enforced on the **backend** (services / middleware).
- The frontend's permission helpers only control which controls are visible. Hiding a
  button is not a security control.

> Known issue: at least one privileged action is fully checked in the UI but only
> weakly checked in the backend. Tightening it is a workshop exercise.

## Audit logs

- Audit messages and metadata must never contain secrets (raw keys or hashes).
- Every access-lifecycle event must be audited (see `docs/DOMAIN_RULES.md`).

## Rendered markdown

- Service documentation is authored in markdown and rendered in the UI.
- The renderer must **sanitize** output. Raw HTML in service docs must not execute.

> Known issue: the current renderer (`apps/web/src/utils/markdown.ts`) passes raw HTML
> through unsanitized. Sanitizing it is a workshop exercise.

## Secrets in the repo

- No real secrets, tokens, or credentials belong in the repository.
- `.env` is git-ignored; `.env.example` documents the variables with safe defaults.
