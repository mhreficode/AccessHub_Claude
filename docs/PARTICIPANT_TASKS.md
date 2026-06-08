# Participant Tasks

Hands-on tasks for the workshop. Each maps to one or more advanced Claude Code workflows.
Work in small, reviewable changes. When you change behavior, update the docs and tests.

## Task 1 — Understand the codebase

```
Summarize the AccessHub architecture. Identify the frontend entry points, the backend
route structure, the service layer, the repository layer, and the database models.
```

Workflows: `CLAUDE.md` grounding, codebase exploration. Expected: you know where things
live; Claude uses the project memory and imported docs.

## Task 2 — Find and fix an API error inconsistency

```
/review-api
```
then:
```
Find endpoints that do not use the standard API error format
{ error: { code, message, details } }. Fix one endpoint and add or update tests.
```

Workflows: slash commands, the `api-error-standardization` skill, refactoring, tests,
`CLAUDE.md` memory.

## Task 3 — Security review of API key handling

```
/security-review
```

Then fix any place where raw keys may be exposed and add a regression test or a
`scripts/security-check.sh` rule. Watch the `PostToolUse` hook react to your edit.

Workflows: slash commands, hooks, the `security-reviewer` subagent.

## Task 4 — Backend authorization fix

```
Check whether approving an access request is protected only in the frontend or also in
the backend. Ensure only the owning team's service owners or platform admins can
approve. Add tests for unauthorized users.
```

Workflows: senior-developer security thinking, subagents.

## Task 5 — Add the missing audit log

```
Rejected access requests should create audit log entries. Find the approval/rejection
flow, add the missing audit event, and test it.
```

Workflows: the `audit-log-consistency` skill, business-rule consistency.

## Task 6 — Plan the access expiration feature

```
/plan-feature add expiring service access to AccessHub
```

Use plan mode (`Shift+Tab`). Do not implement yet.

Workflows: plan mode, research → plan → implement.

## Task 7 — Create or refine the spec

```
/create-spec
```

Refine the proposal, spec, design, and tasks in `specs/access-expiration/`.

Workflows: spec-driven development, the `spec-driven-feature` skill.

## Task 8 — Implement one access expiration task

```
/loop-iteration
```

Pick one task from `docs/PRD.md` / `specs/access-expiration/tasks.md`, implement only
that task, run the relevant tests, and update `.agent/progress.md`.

Workflows: incremental implementation, the autonomous loop.

## Task 9 — Use subagents for review

```
Review the implementation using separate subagents for correctness, security,
architecture, frontend, and tests. Synthesize the findings.
```

Workflows: subagents, multi-perspective review. Try the `senior-reviewer` output style.

## Task 10 — Update docs

```
Update DOMAIN_RULES.md, API_GUIDELINES.md, and SECURITY.md to match the final
implementation.
```

Workflows: docs as part of engineering.

## Stretch — package and share

```
Add a reusable skill to the accesshub-pack plugin (see docs/PLUGINS_EXERCISE.md), or add
a SQLite MCP server (see docs/MCP_EXERCISE.md).
```

Workflows: plugins/marketplaces, MCP.
