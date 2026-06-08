---
description: Research and plan a feature before writing any code (use in Plan Mode).
argument-hint: [feature description]
allowed-tools: Read, Grep, Glob
model: inherit
---

Plan a feature before writing any code. Feature: $ARGUMENTS

Work in **Plan Mode** (press `Shift+Tab` to cycle into it, or start Claude with
`--permission-mode plan`). Do not edit files until the plan is approved.

1. Research the current implementation. Identify the data model, services, routes,
   frontend components, tests, and docs that the feature touches.
2. Summarize the current behavior in the affected area.
3. Ask any clarifying questions where requirements are ambiguous.
4. Propose an implementation plan split into small, atomic tasks.
5. Include a test plan and call out risks.
6. List the docs that will need updating.

> For the workshop's golden-path feature, run this with:
> `/plan-feature add expiring service access to AccessHub`.
> See `specs/access-expiration/` and `docs/PRD.md`. When the plan is approved, present it
> with `ExitPlanMode`.
