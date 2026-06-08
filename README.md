# AccessHub

AccessHub is a small internal **developer platform and API catalog**. Engineering
teams use it to discover internal services, read API docs, request access, receive
API keys, monitor usage, and review audit history.

> ⚠️ **Workshop repository.** This codebase is intentionally imperfect. It contains
> realistic defects, missing tests, outdated docs, and incomplete features. It is the
> hands-on project for an advanced **Claude Code** workshop. Do not treat it as a
> reference for production-quality code.

## What's inside

```
apps/web        React + Vite + TypeScript dashboard
apps/api        Express + Prisma (SQLite) + Zod backend
prisma          Schema and seed data
docs            Architecture, domain rules, API guidelines, security, PRD, and the
                Claude Code workshop guide + per-feature exercises
specs           Spec-driven workflow for the workshop feature (intentionally incomplete)
scripts         Database, security-check, and workshop helper scripts (also hook targets)
CLAUDE.md       Project memory: rules + imported context, auto-loaded every session
.claude         Claude Code config: settings (hooks), commands, agents, skills, output styles
.claude-plugin  A local plugin marketplace
plugins         A bundled, installable plugin (accesshub-pack)
.mcp.json       An MCP server for grounded read access to docs/specs
.github         CI workflow
```

## Prerequisites

Works on macOS, Linux, and Windows. You need:

- **Node.js 20 or newer** (bundled npm 10+ — this repo uses npm workspaces)
- **Git** (to clone the repo)
- **Claude Code** installed (`claude`) — see https://code.claude.com/docs
- No database server to install — the app uses a local SQLite file.

Check your versions:

```bash
node -v   # v20.x or higher
npm -v    # 10.x or higher
claude --version
```

## Setup (under 5 minutes)

```bash
# 1. Get the code and enter the project
git clone <repository-url> accesshub
cd accesshub
# (if you received a zip instead, unzip it and `cd` into the folder)

# 2. Install dependencies
npm install

# 3. Create your env file (defaults work as-is)
cp .env.example .env        # Windows PowerShell: copy .env.example .env

# 4. Generate the Prisma client, create the SQLite DB, and seed it
npm run prisma:generate
npm run db:push
npm run db:seed

# 5. (optional) Confirm everything is ready
npm run workshop:validate
```

## Run it

Open two terminals (both from the project root):

```bash
# Terminal 1 — backend API on http://localhost:4000
npm run dev:api

# Terminal 2 — frontend on http://localhost:5173
npm run dev:web
```

Then open **http://localhost:5173**. The frontend proxies API calls to the backend, so
you only browse that one URL.

Use the **user switcher** in the top-right to act as different seeded users (a
developer, service owners, and a platform admin). The frontend sends the selected
user's id as the `x-user-id` header — this is the workshop's simplified stand-in for
real authentication.

> Ports: API `4000`, frontend `5173`. To change the API port, set `API_PORT` in `.env`
> **and** update the proxy target in `apps/web/vite.config.ts`.

## Open it in Claude Code

```bash
claude
```

On start, the `SessionStart` hook validates the workshop state and `CLAUDE.md` (with its
imported context) loads automatically. Useful first commands:

- `/context` — see what's loaded into the context window.
- `/` — list the bundled slash commands (`/plan-feature`, `/review-api`,
  `/security-review`, `/generate-tests`, `/create-spec`, `/loop-iteration`).
- `/agents` — the review subagents. `/skills` — the repo skills. `/mcp` — the MCP server.

## Reset and reseed the database

```bash
npm run db:reset        # drops, re-pushes, and reseeds the SQLite DB
npm run workshop:reset  # full reset to the known workshop starting state
```

## Tests, lint, types

```bash
npm test            # api + web test suites
npm run test:api    # backend (Vitest + Supertest)
npm run test:web    # frontend (Vitest + Testing Library)
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit for both apps
```

Some tests are **intentionally skipped** — they describe the workshop feature
(Expiring Service Access) that participants implement. See `docs/PRD.md`.

## Roles

| Role | Can do |
|------|--------|
| `developer` | View services, request access, view own keys and requests |
| `service_owner` | Approve/reject requests and revoke keys for services their team owns |
| `platform_admin` | Manage all services, view all requests and audit logs, revoke any key |

## Where to start (instructors)

Read `docs/WORKSHOP_GUIDE.md` for the 3-hour agenda and `docs/PARTICIPANT_TASKS.md`
for the hands-on exercises. Each Claude Code capability has its own exercise doc
(`docs/HOOKS_EXERCISE.md`, `docs/SUBAGENTS_EXERCISE.md`, `docs/PLUGINS_EXERCISE.md`,
`docs/MCP_EXERCISE.md`, `docs/CONTEXT_EXERCISE.md`, `docs/MEMORY_EXERCISE.md`,
`docs/PLAN_MODE_EXERCISE.md`, `docs/SLASH_COMMANDS_EXERCISE.md`,
`docs/OUTPUT_STYLES_EXERCISE.md`, `docs/AUTONOMOUS_LOOP_EXERCISE.md`,
`docs/HEADLESS_EXERCISE.md`). `docs/KNOWN_ISSUES.md` lists *some* of the planted issues
— others are left for discovery.
