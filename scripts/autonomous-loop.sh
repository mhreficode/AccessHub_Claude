#!/usr/bin/env bash
# Autonomous loop: repeatedly run the per-iteration command while unchecked tasks remain
# in docs/PRD.md. Each iteration picks ONE task, implements it, tests it, and updates
# progress. See docs/AUTONOMOUS_LOOP_EXERCISE.md.
#
# Usage: scripts/autonomous-loop.sh [max-iterations]
#
# It drives Claude Code headlessly (`claude -p`) with the /loop-iteration slash command.
# `--dangerously-skip-permissions` lets it run unattended — only use it in a throwaway
# workshop checkout you can reset. In a live session you may prefer to run
# `/loop-iteration` by hand to keep control. This script is a workshop artifact and is
# not run in CI.
set -euo pipefail
cd "$(dirname "$0")/.."

MAX=${1:-8}
i=0

while grep -q '\- \[ \]' docs/PRD.md; do
  i=$((i + 1))
  if [ "$i" -gt "$MAX" ]; then
    echo "Max iterations ($MAX) reached."
    exit 1
  fi

  echo "=== Autonomous iteration $i ==="
  claude -p "/loop-iteration" --permission-mode acceptEdits --dangerously-skip-permissions
done

echo "All PRD tasks completed."
