#!/usr/bin/env bash
# Append a timestamped entry to the tool-use log. Used by the Claude Code PreToolUse hook
# in .claude/settings.json.
#
# Claude Code pipes a JSON event to this hook on stdin, e.g.
#   { "tool_name": "Bash", "tool_input": { ... }, ... }
# We extract tool_name (best-effort, no jq dependency) and log it. Always exits 0 so it
# never blocks a tool call.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 0

input="$(cat 2>/dev/null || true)"
tool="$(printf '%s' "$input" \
  | grep -oE '"tool_name"[[:space:]]*:[[:space:]]*"[^"]*"' \
  | head -1 \
  | sed -E 's/.*:[[:space:]]*"([^"]*)"/\1/' || true)"

mkdir -p .agent/logs
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) tool-use ${tool:-unknown}" >> .agent/logs/tool-use.log
exit 0
