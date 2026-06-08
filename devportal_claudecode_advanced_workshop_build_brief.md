# DevPortal Workshop Codebase Build Brief — Claude Code Edition

## 1. Purpose of This Document

This document is a complete implementation brief for building a workshop-ready codebase
that teaches **Claude Code**. The codebase (shipped here as **AccessHub**) is a
realistic, medium-sized, intentionally imperfect brownfield project that lets
participants experience how a senior developer uses Claude Code across advanced
workflows.

The workshop demonstrates Claude Code as far more than autocomplete:

- Understanding a codebase
- Following project memory (`CLAUDE.md`) and `@`-imported context
- Working with domain documentation
- Using **hooks** to control or validate agent behavior
- Using **slash commands** and reusable **skills**
- Using **subagents** for isolated review perspectives
- Using **plugins and marketplaces** to share agent setup across repos
- Using **MCP** servers to connect external tools and data
- Using **plan mode** to research before editing
- Using the **autonomous loop** (headless `claude -p`)
- Using **spec-driven development**
- Using **output styles** to shape the working voice
- Fixing bugs, adding tests, updating docs, and improving architecture

The app concept is deliberately different from a task manager or incident app.

---

## 2. App Concept — Internal Developer Platform and API Catalog

A company has many internal APIs and services. Developers use the portal to discover
services, read API docs, request access, receive API keys, see usage/rate-limit info,
review audit history, and manage ownership and access. The whole app feels like a simple
internal dashboard used by developers and platform engineers.

---

## 3–12. Product, Complexity, Stack, Roles, UI, Features, Issues, Structure, Docs

These are **identical to the Copilot edition** — the application code, the domain, the
intentional defects, the database schema, the API surface, the seed data, and the core
documentation (`ARCHITECTURE.md`, `DOMAIN_RULES.md`, `API_GUIDELINES.md`, `SECURITY.md`,
`PRD.md`, `KNOWN_ISSUES.md`) are the same. The workshop value comes from the *agent
tooling layer*, which is where this edition differs. See the Copilot-edition brief for
the full product spec; the sections below replace everything Copilot-specific with the
Claude Code equivalent.

Repository structure (agent-tooling layer):

```txt
accesshub/
  CLAUDE.md                      project memory (rules) + @imports of curated context
  .claude/
    settings.json                hooks + permissions + statusLine
    statusline.sh
    commands/                    slash commands (.md)
      plan-feature.md
      review-api.md
      security-review.md
      generate-tests.md
      create-spec.md
      loop-iteration.md
    agents/                      subagents (.md, with name/description/tools/model)
      thorough-reviewer.md
      security-reviewer.md
      api-architect.md
      frontend-reviewer.md
      test-engineer.md
    skills/                      skills (<name>/SKILL.md)
      api-error-standardization/SKILL.md
      secure-api-key-handling/SKILL.md
      audit-log-consistency/SKILL.md
      test-generation/SKILL.md
      spec-driven-feature/SKILL.md
    output-styles/
      senior-reviewer.md
  .claude-plugin/
    marketplace.json             local marketplace catalog
  plugins/
    accesshub-pack/
      .claude-plugin/plugin.json
      commands/ (service-review, test-generation)
      skills/ (secure-api-key-handling, api-error-standardization, api-style, security-baseline)
      agents/ (security-reviewer)
      README.md
  .mcp.json                      MCP server (filesystem over docs/ + specs/)
  scripts/
    security-check.sh  detect-secrets.sh  log-tool-use.sh  validate-workshop-state.sh
    reset-db.sh  seed-demo-data.sh  autonomous-loop.sh
  .github/workflows/ci.yml
  docs/  (workshop guide, exercises, context) ...
```

---

## 13. Project Memory — `CLAUDE.md`

Where Copilot uses `.github/copilot-instructions.md`, Claude Code uses `CLAUDE.md` at the
repo root. It is loaded automatically every session.

It should instruct Claude to follow repository conventions (architecture, API error
shape, security, testing, workshop rules) and end with `@` imports that inline the
curated context:

```
@docs/PROJECT_CONTEXT.md
@docs/DOMAIN_RULES.md
```

Teach the memory hierarchy: `./CLAUDE.md` (shared), `./CLAUDE.local.md` (personal,
git-ignored), `~/.claude/CLAUDE.md` (user-global), and `@path` imports. `#` quick-adds a
memory; `/memory` edits the files; `/context` shows what's loaded.

---

## 14. Slash Commands — `.claude/commands/`

Reusable, parameterized prompts as Markdown. Each file has optional frontmatter
(`description`, `argument-hint`, `allowed-tools`, `model`) and a body that can use
`$ARGUMENTS`, `$1`, `!bash`, and `@file`. Ship: `plan-feature`, `review-api`,
`security-review`, `generate-tests`, `create-spec` (partial), `loop-iteration`.

---

## 15. Subagents — `.claude/agents/`

Separate agents with their own system prompt, tools, and context window. Frontmatter:
`name`, `description` (drives automatic delegation), `tools` (scope — reviewers are
read-only), `model`. Ship: `thorough-reviewer`, `security-reviewer`, `api-architect`,
`frontend-reviewer`, `test-engineer`. Manage with `/agents`.

---

## 16. Skills — `.claude/skills/<name>/SKILL.md`

Repo-specific playbooks Claude pulls in automatically when relevant. Frontmatter: `name`,
`description` (when to use it), optional `allowed-tools`. Ship: `api-error-standardization`,
`secure-api-key-handling`, `audit-log-consistency`, `test-generation`,
`spec-driven-feature` (partial).

---

## 17. Hooks — `.claude/settings.json`

Deterministic shell commands around the agent lifecycle. Events used here:

- `SessionStart` → `scripts/validate-workshop-state.sh`
- `PreToolUse` (matcher `Bash|Write|Edit|MultiEdit`) → `scripts/log-tool-use.sh`
- `PostToolUse` (matcher `Write|Edit|MultiEdit`) → `scripts/security-check.sh`

Teach: hooks get the event JSON on **stdin**; **exit code 2 blocks**; use
`$CLAUDE_PROJECT_DIR` for script paths so a changed cwd never breaks the hook. The
workshop exercise turns the warning-only security check into a blocking `PreToolUse` gate.

---

## 18. Hook Scripts — `scripts/`

`security-check.sh` (warn by default, `STRICT=1` to fail), `detect-secrets.sh`,
`log-tool-use.sh` (parses `tool_name` from stdin), `validate-workshop-state.sh` (checks
deps, DB, docs, and Claude Code assets), `reset-db.sh`, `seed-demo-data.sh`,
`autonomous-loop.sh`.

---

## 19. Plugins & Marketplaces — `.claude-plugin/` + `plugins/`

Where Copilot uses APM packages, Claude Code uses plugins distributed via marketplaces.

- `.claude-plugin/marketplace.json` — the catalog (name, owner, `plugins[]`).
- `plugins/accesshub-pack/.claude-plugin/plugin.json` — plugin metadata.
- The plugin bundles `commands/`, `skills/`, and `agents/` (and may bundle `hooks/` and
  `.mcp.json`). Components are namespaced `accesshub-pack:<name>`.

Install from a checkout: `/plugin marketplace add .` then
`/plugin install accesshub-pack@accesshub-marketplace`. Demonstrates: *teams can package
and share an entire agent setup across repositories as one versioned unit.*

---

## 20. MCP — `.mcp.json`

Project-scoped Model Context Protocol servers, checked in and shared. Ship a filesystem
server (`accesshub-context`) over `./docs` and `./specs` for grounded read access.
Manage with `/mcp`. Teach scopes (local/project/user) and that large MCP tool surfaces
are deferred via Tool Search to protect the context budget.

---

## 21. Context & Memory Exercises

`docs/PROJECT_CONTEXT.md` is the curated, self-contained context document (the analogue
of a Copilot Space doc), imported by `CLAUDE.md`. Exercises: `docs/CONTEXT_EXERCISE.md`
(CLAUDE.md, imports, `/context`, `/compact`, `/clear`) and `docs/MEMORY_EXERCISE.md`
(memory hierarchy, `#`, `/memory`).

---

## 22. Spec-Driven Development — `specs/access-expiration/`

Same as the Copilot edition: `proposal.md`, `spec.md`, `design.md`, `tasks.md`, shipped
intentionally incomplete with TODOs. Driven by the `/create-spec` command and the
`spec-driven-feature` skill.

---

## 23. Plan Mode Exercise

Built-in permission mode: research/read only until the plan is approved. Enter with
`Shift+Tab`, `--permission-mode plan`, or `/plan-feature`. Claude presents the plan via
`ExitPlanMode`. See `docs/PLAN_MODE_EXERCISE.md`.

---

## 24. Autonomous Loop Exercise

The Claude Code analogue of a "Ralph loop": a `while` loop around headless `claude -p`,
each iteration a clean context. Inputs: `docs/PRD.md`, `/loop-iteration`,
`.agent/progress.md`, `scripts/autonomous-loop.sh`. See `docs/AUTONOMOUS_LOOP_EXERCISE.md`.

---

## 25. Subagent Exercise

Multi-perspective review using the five subagents, synthesized into one prioritized
review. See `docs/SUBAGENTS_EXERCISE.md`.

---

## 26. Headless / CLI Exercise

`claude -p "..."` with `--output-format`, `--permission-mode`, `--allowedTools`, `-c`,
and stdin piping. See `docs/HEADLESS_EXERCISE.md`.

---

## 27. Hooks Exercise

See `docs/HOOKS_EXERCISE.md` — detect a raw-key log, fix it, then convert the warning
into a blocking `PreToolUse` exit-2 gate.

---

## 28. Plugins Exercise

See `docs/PLUGINS_EXERCISE.md` — install the local plugin, run a packaged command, add a
reusable skill to the pack.

---

## 29. Output Styles Exercise

`.claude/output-styles/senior-reviewer.md` reshapes the main agent's review voice.
Manage with `/output-style`. See `docs/OUTPUT_STYLES_EXERCISE.md`.

---

## 30. Participant Tasks

See `docs/PARTICIPANT_TASKS.md` — ten tasks mapping the planted issues and the golden-path
feature to Claude Code workflows (slash commands, subagents, hooks, plan mode, autonomous
loop), plus a plugins/MCP stretch task.

---

## 31. Suggested 3-Hour Agenda

See `docs/WORKSHOP_GUIDE.md`.

---

## 32. Prebuilt vs Participant-Built

- **Prebuilt:** the running app, schema/seed, baseline tests, all docs, `CLAUDE.md`, the
  `.claude/` assets, the plugin/marketplace, `.mcp.json`, hook scripts, the spec
  skeleton, PRD/backlog, known issues, workshop guide, demo script.
- **Left for participants:** the Expiring Service Access feature, the error-shape
  refactor, authorization/security/audit fixes, the missing tests, doc updates, hook
  improvements, new plugin skills, spec finalization.
- **Intentionally partial:** `specs/access-expiration/*`, `docs/PRD.md`,
  `.claude/commands/create-spec.md`, `.claude/skills/spec-driven-feature/SKILL.md`,
  `scripts/security-check.sh`, `apps/api/src/tests/accessExpiration.skip.test.ts`, and
  some error/audit/permission tests.

---

## 33–37. Schema, Endpoints, Frontend, Testing, CI

Identical to the Copilot edition (same Prisma models, same endpoints, same React
dashboard, same test layout, same `.github/workflows/ci.yml`). CI runs install → prisma
generate → lint → typecheck → test.

---

## 38. Acceptance Criteria (Claude Code edition)

The generated repository is acceptable when:

1. `README.md` explains setup and the Claude Code workshop purpose.
2. Frontend dashboard runs and displays seeded data.
3. Backend API runs and serves all core endpoints.
4. SQLite/Prisma setup works.
5. Tests run, with some passing and some intentionally skipped.
6. `docs/` includes all required workshop documentation and per-feature exercises.
7. `CLAUDE.md` exists with imported context.
8. `.claude/settings.json` defines hooks (SessionStart, PreToolUse, PostToolUse).
9. `scripts/` contains hook and workshop scripts.
10. `.claude/commands/` contains reusable slash commands.
11. `.claude/agents/` contains subagent definitions.
12. `.claude/skills/` contains skills.
13. `.claude-plugin/marketplace.json` and `plugins/accesshub-pack/` exist and are installable.
14. `.mcp.json` declares at least one MCP server.
15. `specs/access-expiration/` exists and is intentionally incomplete.
16. `docs/PRD.md` includes workshop tasks.
17. There are 8–12 intentional issues suitable for exercises.
18. The access expiration feature is not fully implemented.
19. The repo can be reset to a known state.
20. No real secrets or credentials are included.
21. The overall complexity fits a 3-hour advanced workshop.

---

## 39. Final Note

Build this as a complete workshop repository, not a production app. Prioritize workshop
usefulness, clear structure, strong Claude Code demonstration opportunities, realistic
defects, documentation quality, and easy local setup. Do not fully solve every issue —
participants must have meaningful work to do.
