#!/usr/bin/env bash
# Reset the SQLite database to the seeded workshop starting state.
set -euo pipefail
cd "$(dirname "$0")/.."

export DATABASE_URL="${DATABASE_URL:-file:./dev.db}"

echo "Resetting database ($DATABASE_URL)…"
npx prisma db push --force-reset --skip-generate --accept-data-loss
echo "Seeding…"
npx tsx prisma/seed.ts
echo "Done."
