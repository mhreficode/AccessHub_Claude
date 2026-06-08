import { execSync } from 'node:child_process';

/**
 * Vitest global setup: create a fresh test SQLite database from the Prisma schema.
 * Uses a dedicated DATABASE_URL so tests never touch prisma/dev.db.
 */
export default function setup(): void {
  const env = { ...process.env, DATABASE_URL: 'file:./test.db' };
  execSync(
    'npx prisma db push --force-reset --skip-generate --accept-data-loss --schema ../../prisma/schema.prisma',
    { stdio: 'inherit', env },
  );
}
