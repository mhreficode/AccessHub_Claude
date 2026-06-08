import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { resetDb, prisma } from './helpers';

const app = createApp();

beforeEach(async () => {
  await resetDb();
});

describe('GET /api/api-keys', () => {
  it('returns the developer’s keys with masked values (no hash)', async () => {
    const res = await request(app).get('/api/api-keys').set('x-user-id', 'u-nina');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const key of res.body) {
      expect(key).not.toHaveProperty('keyHash');
      expect(key.maskedKey).toContain('•');
    }
  });
});

describe('POST /api/api-keys/:id/revoke', () => {
  it('revokes an active key and audits it', async () => {
    const res = await request(app)
      .post('/api/api-keys/key-active/revoke')
      .set('x-user-id', 'u-nina');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('revoked');

    const updated = await prisma.apiKey.findUnique({ where: { id: 'key-active' } });
    expect(updated?.status).toBe('revoked');

    const audit = await prisma.auditLog.findFirst({
      where: { action: 'apikey.revoked', entityId: 'key-active' },
    });
    expect(audit).not.toBeNull();
  });

  it('returns 404 for an unknown key', async () => {
    const res = await request(app)
      .post('/api/api-keys/does-not-exist/revoke')
      .set('x-user-id', 'u-nina');
    expect(res.status).toBe(404);
  });

  // NOTE: there is no test yet that a revoked key is rejected by validateKey().
  // Adding that coverage is a workshop task (see docs/KNOWN_ISSUES.md).
});
