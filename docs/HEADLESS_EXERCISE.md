# Headless / CLI Exercise

Claude Code is a terminal-native agent. Beyond the interactive REPL, it has a
**headless** mode (`claude -p "..."`) for one-shot and scripted use — ideal for analysis,
CI, and the autonomous loop. Supported flags evolve; adapt during the live demo
(`claude --help`).

## Interactive vs headless

```bash
claude                       # interactive session in this repo
claude "summarize the backend routes"   # interactive, with an opening prompt
claude -p "summarize the backend routes and flag inconsistent error responses"  # headless, prints once and exits
```

Useful flags:

```bash
claude -p "..." --output-format json          # structured result (good for scripts)
claude -p "..." --output-format stream-json    # streamed events
claude -p "..." --permission-mode plan         # research/plan only, no edits
claude -p "..." --allowedTools "Read Grep Glob" # restrict tools for a read-only pass
claude -c                                       # continue the most recent conversation
cat error.log | claude -p "explain the root cause"   # pipe stdin in
```

## Example prompts (read-only analysis)

```bash
claude -p "Summarize the backend routes in apps/api/src/routes and identify inconsistent error responses." --allowedTools "Read Grep Glob"

claude -p "Find where API keys are generated, stored, logged, or displayed. Identify security risks." --allowedTools "Read Grep Glob"

claude -p "Inspect the skipped access-expiration tests and propose an implementation plan." --permission-mode plan

claude -p "Find the most likely reason the API key revocation test is incomplete and suggest missing test cases." --allowedTools "Read Grep Glob"
```

## Suggested flow

1. **Map the surface.** Ask for a route summary; compare with `docs/API_GUIDELINES.md`.
2. **Hunt risks.** Ask about API key handling; cross-check `docs/SECURITY.md`.
3. **Find the gaps.** Ask about skipped/weak tests; confirm against `apps/api/src/tests`.
4. **Plan, don't implement.** Use `--permission-mode plan` for one PRD item.
5. **Pipe it into a script.** Use `--output-format json` and parse the `result` field —
   this is exactly how `scripts/autonomous-loop.sh` drives Claude unattended.

## Note

The repo provides the prompts and scripts; the instructor adapts the exact CLI flags to
the installed version. Pair this with `docs/AUTONOMOUS_LOOP_EXERCISE.md` to see headless
mode running in a loop.
