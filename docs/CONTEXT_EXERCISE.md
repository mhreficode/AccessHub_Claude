# Context Exercise (CLAUDE.md, imports, /context, /compact)

Where GitHub Copilot uses "Spaces" to bundle context, Claude Code grounds itself with
`CLAUDE.md` (auto-loaded project memory), `@` file imports, and live context commands.
AccessHub is wired so the curated domain context is always present.

## How AccessHub grounds Claude

- `CLAUDE.md` at the repo root is loaded automatically every session.
- It ends with two `@` imports that inline curated context:

  ```
  @docs/PROJECT_CONTEXT.md
  @docs/DOMAIN_RULES.md
  ```

- `docs/PROJECT_CONTEXT.md` is the single self-contained summary of product, domain,
  architecture, API, and security — the analogue of a curated Space document.

## Flow

1. Run `/context` to see what is currently loaded into the context window (CLAUDE.md,
   the imported docs, tools, and how much budget each consumes).
2. Ask a grounded question and watch Claude cite the imported rules:

   ```
   Who is allowed to approve access requests in AccessHub, and where should that check live?
   ```

3. Temporarily comment out the two `@` imports in `CLAUDE.md`, start a fresh session,
   and ask the same question. Compare: answers get more generic without the context.
4. Restore the imports.

## Other context controls to demonstrate

- `/clear` — wipe the conversation to start a clean task (cheap, fast).
- `/compact` — summarize a long conversation to free context while keeping the thread.
- `#` at the start of a message — quick-add a durable memory to `CLAUDE.md` (see
  `docs/MEMORY_EXERCISE.md`).
- `@path` — pull any file or directory into the current prompt on demand.

## What to observe

With the imports in place, answers should cite the domain rules and point at the right
layers (services for logic, repositories for data, `authz.service` for permissions).
Without them, answers drift toward generic advice.
