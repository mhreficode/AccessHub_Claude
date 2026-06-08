# Plan Mode Exercise

**Plan Mode** makes Claude Code research and propose a plan *without touching files*. It
is a built-in permission mode — Claude can read, search, and analyze, but every edit and
command is withheld until you approve the plan. It is the safest way to start a
non-trivial change.

## Enter plan mode

- Press `Shift+Tab` to cycle permission modes until you see **plan mode**, or
- Start Claude with `--permission-mode plan`, or
- Run the project command `/plan-feature <description>`.

When Claude finishes researching it calls `ExitPlanMode` to present the plan; you approve
or send it back for changes. Nothing is written until you accept.

## The golden-path exercise

```
/plan-feature add expiring service access to AccessHub
```

or, in plan mode:

```
We need to add expiring service access to AccessHub.

First research the current codebase. Identify the files, data model, services, endpoints,
tests, and docs affected by this feature. Then create an implementation plan with atomic
tasks. Do not implement until I approve the plan.
```

Expected output: a summary of the current access flow, the affected files, clarifying
questions, an implementation plan, a test plan, risks, and the docs to update — followed
by an approval prompt.

See `specs/access-expiration/` and `docs/PRD.md` for the feature scope.

## Discussion points

- Why "research → plan → approve → implement" beats jumping straight to edits on a
  brownfield codebase.
- How plan mode pairs with subagents (delegate research) and with the spec workflow
  (`/create-spec`).
- How approving a plan then dropping into `acceptEdits` mode lets implementation flow
  without re-approving every edit.
