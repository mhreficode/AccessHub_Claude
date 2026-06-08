---
description: Create or refine a spec for the access-expiration feature (spec-driven development).
allowed-tools: Read, Grep, Glob, Edit, Write
model: inherit
---

> This command is intentionally lightweight — extend it during the workshop.

Drive spec-driven development for the Expiring Service Access feature.

Using the existing skeleton in `specs/access-expiration/`, produce or refine:

1. `proposal.md` — intent, motivation, goals, non-goals, open questions.
2. `spec.md` — requirements with Given/When/Then scenarios. Resolve the `TODO` markers.
3. `design.md` — data model, evaluation strategy (lazy vs scheduled), service/API/
   frontend changes. Pick the open decisions and justify them.
4. `tasks.md` — a top-to-bottom list of small, testable tasks.

Keep the spec consistent with `docs/DOMAIN_RULES.md` and `docs/SECURITY.md`. Do not
implement code from this command — only the spec files.

<!-- TODO(workshop): add acceptance-criteria and review checklist sections here. -->
