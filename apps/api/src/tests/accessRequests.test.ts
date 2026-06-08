import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { resetDb, prisma } from './helpers';

const app = createApp();

beforeEach(async () => {
  await resetDb();
});

describe('POST /api/access-requests/:id/approve', () => {
  it('approves a pending request and issues a key (happy path)', async () => {
    const res = await request(app)
      .post('/api/access-requests/req-pending/approve')
      .set('x-user-id', 'u-omar');

    expect(res.status).toBe(200);
    expect(res.body.request.status).toBe('approved');
    expect(res.body.rawKey).toMatch(/^ah_live_/);
    // The masked key must not leak the hash.
    expect(res.body.apiKey).not.toHaveProperty('keyHash');
  });

  it('writes an audit event when access is approved', async () => {
    await request(app).post('/api/access-requests/req-pending/approve').set('x-user-id', 'u-omar');
    const audit = await prisma.auditLog.findFirst({
      where: { action: 'access.approved', entityId: 'req-pending' },
    });
    expect(audit).not.toBeNull();
  });

  it('forbids developers from approving', async () => {
    const res = await request(app)
      .post('/api/access-requests/req-pending/approve')
      .set('x-user-id', 'u-nina');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('conflicts when the request is not pending', async () => {
    const res = await request(app)
      .post('/api/access-requests/req-approved/approve')
      .set('x-user-id', 'u-omar');
    expect(res.status).toBe(409);
  });
});

describe('POST /api/access-requests/:id/reject', () => {
  it('rejects a pending request', async () => {
    const res = await request(app)
      .post('/api/access-requests/req-pending/reject')
      .set('x-user-id', 'u-omar')
      .send({ rejectionReason: 'Use the shared dashboard instead.' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('rejected');
  });
});

describe('GET /api/access-requests', () => {
  it('returns only the developer’s own requests', async () => {
    const res = await request(app).get('/api/access-requests').set('x-user-id', 'u-nina');
    expect(res.status).toBe(200);
    expect(res.body.every((r: { requesterUserId: string }) => r.requesterUserId === 'u-nina')).toBe(
      true,
    );
  });
});
