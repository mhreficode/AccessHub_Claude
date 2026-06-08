# Output Styles Exercise

**Output styles** change *how* Claude Code communicates by swapping its system prompt,
without changing what tools it has. They are a lightweight way to put Claude in a
specific working voice — here, a terse senior reviewer. AccessHub ships one in
`.claude/output-styles/`.

## Bundled style

`.claude/output-styles/senior-reviewer.md` — findings-first, severity-tagged,
smallest-fix-oriented, with this repo's security rules baked in.

```markdown
---
name: Senior Reviewer
description: Terse, senior-engineer review voice — findings first, severity-tagged.
---
You are acting as a senior engineer reviewing changes ...
```

## Use it

- `/output-style` — list available styles and switch interactively.
- `/output-style senior-reviewer` — activate this style.
- `/output-style default` — switch back.

## Try it

1. Activate the style: `/output-style senior-reviewer`.
2. Ask for a review:
   ```
   Review apps/api/src/services/apiKey.service.ts and apps/web/src/utils/markdown.ts.
   ```
3. Note the difference: findings grouped by Critical / Important / Nice-to-have, each as
   `file:line — problem — smallest fix`, no preamble.
4. Switch back to `default` and re-ask to compare tone and verbosity.

## Instructor task — author a style

```
Create an output style called "mentor" that explains its reasoning step by step and
teaches the underlying concept after each fix it proposes — aimed at a junior developer
learning this codebase. Save it at .claude/output-styles/mentor.md.
```

## Discussion points

- Output styles vs `CLAUDE.md` vs subagents: a style reshapes the *main* agent's voice
  for the whole session; `CLAUDE.md` adds rules; a subagent is a separate agent with its
  own prompt and context.
- When a consistent review voice helps a team standardize PR feedback.
