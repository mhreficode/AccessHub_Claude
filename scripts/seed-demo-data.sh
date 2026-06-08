#!/usr/bin/env bash
# Seed the database with the known workshop demo data (without dropping the schema).
set -euo pipefail
cd "$(dirname "$0")/.."

export DATABASE_URL="${DATABASE_URL:-file:./dev.db}"
npx tsx prisma/seed.ts
