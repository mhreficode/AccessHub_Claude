# Subagents Exercise

Claude Code **subagents** are separate agents with their own system prompt, tools, and
context window. They keep a review perspective isolated (so it isn't diluted by the main
conversation) and they run in parallel. AccessHub ships five, in `.claude/agents/`.

## Available subagents

| Subagent | Focus | Tools |
|----------|-------|-------|
| `.claude/agents/thorough-reviewer.md` | Coordinates all perspectives | read-only + Bash |
| `.claude/agents/security-reviewer.md` | Key leakage, authz, audit secrets, unsafe markdown | read-only + Bash |
| `.claude/agents/api-architect.md` | Layering, validation, error format | read-only |
| `.claude/agents/frontend-reviewer.md` | Permission UI, stale state, unsafe rendering | read-only |
| `.claude/agents/test-engineer.md` | Missing tests, edge cases, skipped tests | read-only + Bash |

Each file has YAML frontmatter (`name`, `description`, `tools`, `model`) followed by the
subagent's system prompt. The `description` is what Claude uses to decide when to
delegate automatically.

## Manage them

- `/agents` — list, create, and edit subagents interactively.
- Invoke explicitly: *"Use the security-reviewer subagent to check the approve flow."*
- Or let Claude delegate automatically based on the `description` field.

## Instructor prompt

```
Review the access-expiration implementation using separate perspectives, kept isolated:
1. Correctness
2. Security        (use the security-reviewer subagent)
3. API architecture (use the api-architect subagent)
4. Frontend        (use the frontend-reviewer subagent)
5. Test coverage   (use the test-engineer subagent)

Then synthesize the findings into a single prioritized review (the thorough-reviewer
subagent can coordinate this).
```

## Expected output shape

- Critical issues
- Important issues
- Nice-to-have improvements
- What the implementation does well
- Suggested next steps

## Discussion points

- Why an isolated context window surfaces issues a single pass misses, and avoids
  "context pollution" between perspectives.
- How parallel subagents speed up a multi-angle review.
- How the `tools` field (read-only here) keeps reviewers from accidentally editing code.
- How merging overlapping findings and ranking by risk produces one actionable review.
