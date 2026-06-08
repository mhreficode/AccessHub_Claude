import { createHash, randomBytes } from 'node:crypto';

/**
 * API key generation and hashing.
 *
 * Security rules (see docs/SECURITY.md):
 *  - The raw key is shown to the user exactly once, at creation.
 *  - Only the prefix and a hash of the key are stored.
 *  - The raw key must never be logged or persisted.
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export interface GeneratedKey {
  raw: string;
  prefix: string;
  hash: string;
}

function randomToken(length: number): string {
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function hashKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

export function generateApiKey(): GeneratedKey {
  const raw = `ah_live_${randomToken(24)}`;
  // The prefix is safe to store and display (first 10 chars).
  const prefix = raw.slice(0, 10);
  return { raw, prefix, hash: hashKey(raw) };
}

/** Mask a stored prefix for display, e.g. "ah_live_lP••••••••". */
export function maskKey(prefix: string): string {
  return `${prefix}${'•'.repeat(8)}`;
}
