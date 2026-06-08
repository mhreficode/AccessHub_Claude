# Autonomous Loop Exercise

An autonomous loop repeatedly runs the same focused prompt so the agent picks one small
task at a time, keeps its context fresh, and makes incremental, reviewable progress. With
Claude Code this is just **headless mode in a `while` loop** — each iteration is a clean
`claude -p` invocation, so context never bloats across tasks.

## Inputs

- `docs/PRD.md` — the checklist of tasks (unchecked = `- [ ]`).
- `.claude/commands/loop-iteration.md` — the per-iteration slash command (`/loop-iteration`).
- `.agent/progress.md` — progress notes each iteration appends to.
- `scripts/autonomous-loop.sh` — the driver script.

## What each iteration does

1. Read `docs/PRD.md` and pick the **next single unchecked task**.
2. Implement only that task — the smallest reasonable change.
3. Run the relevant tests.
4. Append a note to `.agent/progress.md`.
5. Mark the task complete in `docs/PRD.md` **only if** tests pass.
6. Stop — do not continue to the next task in the same iteration.

Because each iteration is a fresh `claude -p "/loop-iteration"` process, it starts with a
clean context window (plus `CLAUDE.md`), which is the whole point: small, isolated, repeatable units of work.

## Run it

```bash
# At most 2 iterations
bash scripts/autonomous-loop.sh 2
```

The script loops while unchecked items remain in `docs/PRD.md`, calling Claude headlessly
with the `/loop-iteration` command. It passes `--dangerously-skip-permissions` so it can
run unattended — **only do this in a throwaway workshop checkout you can reset**
(`npm run workshop:reset`). In a live session you may prefer to run `/loop-iteration` by
hand, or in plan mode, to keep control.

## Try it interactively first

Before unleashing the loop, run a single iteration yourself and read the result:

```
/loop-iteration
```

## Discussion points

- Why one task per iteration keeps each change reviewable and each context window small.
- How `.agent/progress.md` gives the next iteration its bearings.
- When to stop the loop and review before continuing — and why permission scoping
  (`settings.json` allow-list) matters before running anything unattended.
