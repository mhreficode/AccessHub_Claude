# Workshop Guide (Instructor)

A 3-hour advanced **Claude Code** workshop built around AccessHub. The goal is to show
Claude Code as a senior-developer tool: understanding a codebase, following project
memory (`CLAUDE.md`) and domain docs, using hooks, slash commands, skills, subagents,
plugins/marketplaces, MCP, plan mode, the autonomous loop, spec-driven development,
output styles, and headless mode.

## Before the session

```bash
npm install
cp .env.example .env
npm run prisma:generate && npm run db:push && npm run db:seed
npm run dev:api    # terminal 1
npm run dev:web    # terminal 2
```

Confirm the dashboard loads at http://localhost:5173 and tests run with `npm test`.

Optionally validate the workshop assets are present:

```bash
npm run workshop:validate
```

Then open the repo in Claude Code (`claude`). The `SessionStart` hook runs
`validate-workshop-state.sh` automatically, and `CLAUDE.md` (with its imported context)
loads into the session. Run `/context` to show participants what is loaded.

## What's wired for Claude Code

| Capability | Where | Exercise |
|------------|-------|----------|
| Project memory + imports | `CLAUDE.md`, `docs/PROJECT_CONTEXT.md` | `docs/CONTEXT_EXERCISE.md`, `docs/MEMORY_EXERCISE.md` |
| Slash commands | `.claude/commands/` | `docs/SLASH_COMMANDS_EXERCISE.md` |
| Subagents | `.claude/agents/` | `docs/SUBAGENTS_EXERCISE.md` |
| Skills | `.claude/skills/` | (used throughout) |
| Hooks | `.claude/settings.json`, `scripts/` | `docs/HOOKS_EXERCISE.md` |
| Plugins & marketplaces | `.claude-plugin/`, `plugins/` | `docs/PLUGINS_EXERCISE.md` |
| MCP | `.mcp.json` | `docs/MCP_EXERCISE.md` |
| Plan mode | built-in (`Shift+Tab`) | `docs/PLAN_MODE_EXERCISE.md` |
| Autonomous loop | `scripts/autonomous-loop.sh` | `docs/AUTONOMOUS_LOOP_EXERCISE.md` |
| Output styles | `.claude/output-styles/` | `docs/OUTPUT_STYLES_EXERCISE.md` |
| Headless / CLI | `claude -p` | `docs/HEADLESS_EXERCISE.md` |
| Spec-driven dev | `specs/access-expiration/`, `/create-spec` | (golden path) |

## Suggested 3-hour agenda

### 0:00–0:10 — Intro and repo setup
- Explain AccessHub (internal developer platform / API catalog).
- Run the app, show the dashboard and user switcher.
- Open Claude Code; show the `SessionStart` hook output and `/context`.
- Stress that the repo intentionally contains defects and an unfinished feature.

### 0:10–0:35 — Context, CLAUDE.md, and memory
- Walk through `CLAUDE.md` and its `@docs/PROJECT_CONTEXT.md` / `@docs/DOMAIN_RULES.md`
  imports.
- Ask domain questions; toggle the imports to compare grounding.
- Add a convention with `#`. See `docs/CONTEXT_EXERCISE.md`, `docs/MEMORY_EXERCISE.md`.

### 0:35–1:00 — Hooks and security guardrails
- Show `.claude/settings.json` and `scripts/security-check.sh`.
- Have Claude make a change that logs an API key; the `PostToolUse` hook flags it; let
  Claude fix it. Then turn the warning into a blocking `PreToolUse` exit-2 gate.
- See `docs/HOOKS_EXERCISE.md`.

### 1:00–1:25 — Slash commands and skills
- Tour `.claude/commands/` (`/review-api`, `/security-review`, `/generate-tests`).
- Standardize one inconsistent error response with a command; watch the
  `api-error-standardization` skill kick in. See `docs/SLASH_COMMANDS_EXERCISE.md`.

### 1:25–1:40 — Plugins and marketplaces
- Install the bundled plugin: `/plugin marketplace add .` then
  `/plugin install accesshub-pack@accesshub-marketplace`.
- Run a packaged command; add a reusable skill. See `docs/PLUGINS_EXERCISE.md`.

### 1:40–1:50 — Break

### 1:50–2:15 — MCP and headless mode
- Approve the `accesshub-context` MCP server; explore with `/mcp`.
- Run a few `claude -p` analyses from the terminal. See `docs/MCP_EXERCISE.md`,
  `docs/HEADLESS_EXERCISE.md`.

### 2:15–2:40 — Plan mode and spec-driven development
- `/plan-feature add expiring service access to AccessHub`.
- Refine `specs/access-expiration/` with `/create-spec`. Human approves the plan before
  any code. See `docs/PLAN_MODE_EXERCISE.md`.

### 2:40–2:55 — Autonomous loop
- Show the `docs/PRD.md` checklist; run `/loop-iteration` once by hand, then
  `bash scripts/autonomous-loop.sh 2` on a throwaway checkout.
- Review `.agent/progress.md`. See `docs/AUTONOMOUS_LOOP_EXERCISE.md`.

### 2:55–3:00 — Subagents, output styles, and wrap-up
- Run a multi-perspective review with the subagents; try the `senior-reviewer` output
  style. See `docs/SUBAGENTS_EXERCISE.md`, `docs/OUTPUT_STYLES_EXERCISE.md`.
- Summarize what changed and how it maps to senior-developer work.

## Exercise: Plan Mode for Access Expiration

Instructor prompt (or run `/plan-feature add expiring service access to AccessHub`):

```
We need to add expiring service access to AccessHub.

Use Plan Mode. First research the current codebase. Identify the files, data model,
services, endpoints, tests, and docs affected by this feature. Then create an
implementation plan with atomic tasks. Do not implement until I approve the plan.
```

Expected output: a summary of the current access flow, the affected files, clarifying
questions, an implementation plan, a test plan, risks, and the docs to update.

## Which issues to reveal, and when

- Reveal issues #1–#5 from `docs/KNOWN_ISSUES.md` as you reach the matching segment.
- Keep the undocumented issues hidden; use them for the headless/review discovery
  exercises (the `security-reviewer` and `api-architect` subagents are good for this).

## Reset between demos

```bash
npm run workshop:reset   # reset + reseed the database to the known starting state
git stash                # or discard code changes between groups
```
