# Slash Commands Exercise

**Slash commands** are reusable, parameterized prompts stored as Markdown files. Type `/`
in Claude Code to see them. They are how you turn a repeated workflow into a one-liner.
AccessHub ships several in `.claude/commands/`.

## Bundled commands

| Command | What it does |
|---------|--------------|
| `/plan-feature [description]` | Research and plan a feature in plan mode |
| `/review-api [area]` | Review backend API consistency and authorization |
| `/security-review` | Security pass over keys, logging, authz, audit, markdown |
| `/generate-tests [area]` | Add missing tests before changing production code |
| `/create-spec` | Create/refine the access-expiration spec (spec-driven dev) |
| `/loop-iteration` | Do one PRD task, test it, update progress, stop |

Plugin commands (after installing `accesshub-pack`, see `docs/PLUGINS_EXERCISE.md`) appear
namespaced: `/accesshub-pack:service-review`, `/accesshub-pack:test-generation`.

## Anatomy of a command file

Open `.claude/commands/review-api.md`. Note the frontmatter and the body:

```markdown
---
description: Review the backend API for consistency and correctness.
argument-hint: [optional: route file or area]
allowed-tools: Read, Grep, Glob
model: inherit
---

Review the AccessHub backend API ... Scope (optional): $ARGUMENTS ...
```

- `description` shows in the `/` menu.
- `argument-hint` documents expected arguments.
- `allowed-tools` scopes what the command may do (here, read-only).
- `$ARGUMENTS` (and `$1`, `$2`, …) inject what you type after the command.
- A line starting with `!` runs a bash command and inlines its output; `@path` inlines a
  file.

## Try it

```
/review-api apps/api/src/routes/apiKeys.routes.ts
/generate-tests api key revocation
```

## Instructor task — author a command

```
Create a slash command /find-issues that scans the backend for the kinds of planted
defects in docs/KNOWN_ISSUES.md (ad-hoc error shapes, frontend-only authorization,
raw-key logging, missing audit events, unsanitized markdown) and reports each as
file:line + the smallest fix. Make it read-only. Save it at
.claude/commands/find-issues.md.
```

## Discussion points

- Project commands (`.claude/commands/`, shared) vs personal commands
  (`~/.claude/commands/`).
- Why scoping `allowed-tools` makes a command safe to run without babysitting it.
- How commands, skills, and subagents differ: a command is a *prompt you trigger*, a
  skill is *guidance Claude pulls in automatically*, a subagent is a *separate agent*.
