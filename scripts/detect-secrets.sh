#!/usr/bin/env bash
# Scan files for suspicious secret-like patterns.
#
# Usage:
#   scripts/detect-secrets.sh [file ...]
# With no arguments, scans tracked source files under apps/ and prisma/.
#
# Exit code 0 = clean, 1 = at least one match.
set -uo pipefail
cd "$(dirname "$0")/.."

if [ "$#" -gt 0 ]; then
  FILES=("$@")
else
  mapfile -t FILES < <(git ls-files 'apps/**' 'prisma/**' 2>/dev/null)
  if [ "${#FILES[@]}" -eq 0 ]; then
    mapfile -t FILES < <(find apps prisma -type f \
      ! -name '*.db' ! -name '*.db-journal' 2>/dev/null)
  fi
fi

# Patterns are written to avoid being literal secrets themselves.
PATTERNS=(
  'BEGIN [A-Z ]*PRIVATE KEY'
  'AKIA[0-9A-Z]{16}'
  'ah_live_[A-Za-z0-9]{18,}'
)

found=0
for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue
  # Skip seed/fixtures, which use short, clearly-fake placeholder values.
  case "$f" in
    prisma/seed.ts|*/tests/helpers.ts) continue ;;
  esac
  for p in "${PATTERNS[@]}"; do
    # -I skips binary files so we never match inside the SQLite database.
    if grep -InEH "$p" "$f"; then
      found=1
    fi
  done
done

if [ "$found" -ne 0 ]; then
  echo "detect-secrets: suspicious pattern(s) found." >&2
  exit 1
fi
echo "detect-secrets: clean."
