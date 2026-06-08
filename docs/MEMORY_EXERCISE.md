# Memory Exercise (CLAUDE.md)

Claude Code's memory is **file-based and visible**, not a hidden per-repo store. The
project's conventions live in `CLAUDE.md` at the repo root, which Claude loads
automatically every session. You can read it, edit it, and commit it — and you can add to
it without leaving the chat.

## The memory hierarchy

Claude Code merges memory from several places (all are loaded; more specific files take
precedence):

- **Project memory** — `./CLAUDE.md` (checked in, shared with the team). This is where
  AccessHub keeps its rules.
- **Project-local memory** — `./CLAUDE.local.md` (git-ignored, personal to you).
- **User memory** — `~/.claude/CLAUDE.md` (applies across all your projects).
- **Imports** — any `@path` line in a `CLAUDE.md` inlines another file (AccessHub imports
  `docs/PROJECT_CONTEXT.md` and `docs/DOMAIN_RULES.md`).

Run `/memory` to open and edit these files, and `/context` to see what is loaded.

## Conventions AccessHub already encodes

Open `CLAUDE.md` and confirm these are present:

1. Business logic belongs in services; database access belongs in repositories
   (services never import Prisma directly).
2. API errors must use the standard `{ error: { code, message, details } }` shape.
3. Raw API keys are shown once and must never be logged or stored.
4. Every access approval, rejection, and key revocation must create an audit event.
5. Tests should cover both role authorization and domain edge cases.

## Add a memory mid-task

Start a message with `#` and Claude offers to save it to a `CLAUDE.md`:

```
# AccessHub: always validate request bodies with Zod at the route boundary, never in the service layer.
```

Or just ask:

```
Remember that every access lifecycle event (request, approve, reject, key generate,
key revoke) must produce an audit log entry. Add it to CLAUDE.md.
```

## What to observe

After the convention is in `CLAUDE.md`, repeat an earlier task (e.g. "fix this
endpoint's error shape"). The prompt can be shorter because Claude already holds the
convention — and because memory is a file, you can review exactly what it remembers in a
diff.
