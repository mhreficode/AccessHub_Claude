#!/usr/bin/env bash
# Custom Claude Code status line for the AccessHub workshop.
#
# Claude Code pipes a JSON status object to this script on stdin and renders the
# single line it prints. We show: model, current directory name, git branch, and a
# reminder that this is the workshop repo. Parsed with node (already required by the
# project) to stay dependency-free.
#
# See docs/WORKSHOP_GUIDE.md (status line is configured in .claude/settings.json).
input="$(cat)"

line="$(printf '%s' "$input" | node -e '
  let raw = "";
  process.stdin.on("data", d => raw += d);
  process.stdin.on("end", () => {
    let s = {};
    try { s = JSON.parse(raw); } catch (_) {}
    const model = (s.model && s.model.display_name) || "Claude";
    const dir = (s.workspace && s.workspace.current_dir) || s.cwd || process.cwd();
    const base = dir.split("/").filter(Boolean).pop() || dir;
    process.stdout.write(`${model} · ${base}`);
  });
' 2>/dev/null)"

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
[ -n "$branch" ] && line="$line · ⎇ $branch"

printf '%s · AccessHub workshop' "$line"
