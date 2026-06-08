---
name: spec-driven-feature
description: The spec-driven workflow for building a feature in AccessHub — proposal, requirements, design, tasks, implementation, docs. Use when starting a non-trivial feature such as access expiration.
---

> Intentionally lightweight — extend it during the workshop.

# Spec-Driven Feature

How to take a feature from idea to implementation, spec-first.

## Workflow

1. **Proposal** — intent, motivation, goals, non-goals, open questions
   (`specs/<feature>/proposal.md`).
2. **Requirements** — Given/When/Then scenarios; resolve ambiguities
   (`specs/<feature>/spec.md`).
3. **Design** — data model, strategy options and the chosen decision, the
   service/API/frontend changes (`specs/<feature>/design.md`).
4. **Tasks** — small, ordered, testable units (`specs/<feature>/tasks.md`).
5. **Implementation** — one task at a time; test each; keep changes reviewable.
6. **Archive / update docs** — reflect the final behavior in `docs/`.

## Rules

- Do not write implementation code while still in steps 1–4.
- Keep the spec consistent with `docs/DOMAIN_RULES.md` and `docs/SECURITY.md`.
- A task is done only when its tests pass and the docs are updated.

<!-- TODO(workshop): add a review checklist and a "definition of done" section. -->
