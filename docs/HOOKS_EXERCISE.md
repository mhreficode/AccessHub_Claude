# Hooks Exercise

Claude Code **hooks** run your own shell commands around the agent's lifecycle —
before/after a tool call, at session start, when it stops, and more. They are configured
in `.claude/settings.json` and run deterministically, regardless of what the model
decides. AccessHub ships working examples.

## Files

- `.claude/settings.json` — the hook configuration (`SessionStart`, `PreToolUse`,
  `PostToolUse`).
- `scripts/validate-workshop-state.sh` — `SessionStart`: checks deps, DB, docs, and
  Claude Code assets.
- `scripts/log-tool-use.sh` — `PreToolUse`: reads the event JSON on stdin and appends the
  tool name to `.agent/logs/tool-use.log`.
- `scripts/security-check.sh` — `PostToolUse` on edits: scans for planted security issues.

## How Claude Code hooks work

- Each hook is a command. Claude Code pipes a JSON event to it on **stdin** (with
  `tool_name`, `tool_input`, `cwd`, etc.).
- **Exit code 2 blocks** the action and feeds stderr back to Claude. Any other non-zero
  code is a non-blocking warning. Exit 0 is success.
- A `PreToolUse` hook can also return JSON on stdout to allow/deny with a reason.
- Matchers select which tools a hook fires on (e.g. `"Write|Edit|MultiEdit"`).
- Use `$CLAUDE_PROJECT_DIR` for script paths so a changed working directory never breaks
  the hook — AccessHub's settings do exactly this.

## Flow

1. Look at `.claude/settings.json` and `scripts/security-check.sh`.
2. Ask Claude to make a change that accidentally logs an API key:
   ```
   Add a console.log of the raw key in apps/api/src/services/apiKey.service.ts for debugging.
   ```
3. Because `security-check.sh` is a `PostToolUse` hook on edits, it runs right after the
   write and surfaces the finding. You can also run it directly:
   ```bash
   bash scripts/security-check.sh
   ```
4. Let Claude fix the issue and explain the risk.
5. Check `.agent/logs/tool-use.log` — the `PreToolUse` logger recorded the activity.

## Make the hook *block*, not just warn

Right now `security-check.sh` warns (exit 0) unless `STRICT=1`. Improve it so a real
secret-in-a-log is a hard stop:

```
Inspect .claude/settings.json and scripts/security-check.sh. Add a PreToolUse hook
(matcher Write|Edit|MultiEdit) that runs the security check in STRICT mode and exits 2
when it finds a console.log containing key, token, secret, or password — so the edit is
blocked before it lands. Keep the script simple and cross-platform friendly.
```

## Notes

- Discuss when warn-vs-block is appropriate: a `PostToolUse` warning is good for fast
  feedback; a `PreToolUse` exit-2 gate is good for guardrails you must not cross.
- Hooks run with your shell's permissions — review any hook before trusting it.
