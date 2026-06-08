# AccessHub — Claude Code project memory

You are working in the **AccessHub** repository: a TypeScript internal developer
platform and API catalog (React + Vite frontend, Express + Prisma + SQLite backend, npm
workspaces). This repository is intentionally imperfect — it is the hands-on project for
an **advanced Claude Code workshop**.

This file is `CLAUDE.md`. Claude Code loads it automatically at the start of every
session in this project, so the rules below are always in context. Keep it tight: it is
memory, not documentation. The detailed docs are imported at the bottom of this file.

## Architecture rules

- Keep business logic in `apps/api/src/services`.
- Keep database access in `apps/api/src/repositories`. Services must not import Prisma
  directly; the client lives in `apps/api/src/db.ts`.
- Keep route handlers thin (`apps/api/src/routes`): parse, call one service, respond.
- Validate request bodies with Zod schemas in `apps/api/src/validators`, at the route
  boundary. Do not duplicate the same validation in the service layer.
- Enforce authorization on the backend using `apps/api/src/services/authz.service.ts`,
  even when the frontend hides an action.
- Do not put business rules directly in React components.

## API rules

All API errors must use this shape:

```
{ "error": { "code": "ERROR_CODE", "message": "Human readable message", "details": {} } }
```

Produce them via the helpers in `apps/api/src/utils/errors.ts`. See
`docs/API_GUIDELINES.md`.

## Security rules

- Never log raw API keys.
- Never store raw API keys; store only a prefix and a SHA-256 hash.
- Never expose `keyHash` in an API response (use the masked serializer).
- Never put secrets in audit logs.
- Sanitize rendered markdown.
- Authorization must be enforced in backend services or middleware.

## Testing rules

- Add tests for service-layer business logic.
- Add API tests for authorization-sensitive endpoints.
- Include the happy path and at least one edge case.
- Do not delete or weaken existing tests to make a task pass.

## Workshop rules

- This repository intentionally contains defects and one incomplete feature
  (**Expiring Service Access**). Prefer small, reviewable changes.
- When you change behavior, update the relevant docs and tests in the same change.
- When asked to plan, use **plan mode** (press `Shift+Tab` to cycle into Plan Mode, or
  start Claude with `--permission-mode plan`) and do not edit files until the plan is
  approved.

## How this project is wired for Claude Code

- **Subagents** live in `.claude/agents/` (`/agents` to manage them). Use them for
  isolated review perspectives.
- **Slash commands** live in `.claude/commands/` — e.g. `/plan-feature`,
  `/review-api`, `/security-review`, `/generate-tests`, `/create-spec`,
  `/loop-iteration`. Type `/` to list them.
- **Skills** live in `.claude/skills/` and are invoked automatically when relevant
  (`/skills` to list). They encode repo-specific playbooks.
- **Hooks** are configured in `.claude/settings.json` (a `PreToolUse` security check +
  logger, and a `SessionStart` workshop-state validation). See `docs/HOOKS_EXERCISE.md`.
- **A bundled plugin** (`.claude-plugin/marketplace.json` + `plugins/accesshub-pack/`)
  shows how teams package and share commands/skills/agents across repos.
- **An MCP server** is declared in `.mcp.json` (read-only SQLite access to the seeded
  database). See `docs/MCP_EXERCISE.md`.

## Project context (imported)

The curated domain, architecture, API, and security context is imported below so it is
always available. (`@path` imports are a CLAUDE.md feature — Claude Code inlines the
referenced files.)

@docs/PROJECT_CONTEXT.md
@docs/DOMAIN_RULES.md
