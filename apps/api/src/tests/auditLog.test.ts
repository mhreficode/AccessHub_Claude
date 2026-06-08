import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { resetDb } from './helpers';

const app = createApp();

beforeEach(async () => {
  await resetDb();
});

describe('GET /api/audit-log', () => {
  it('is visible to owners and admins', async () => {
    await request(app).post('/api/access-requests/req-pending/approve').set('x-user-id', 'u-omar');
    const res = await request(app).get('/api/audit-log').set('x-user-id', 'u-omar');
    expect(res.status).toBe(200);
    expect(res.body.some((l: { action: string }) => l.action === 'access.approved')).toBe(true);
  });

  it('is forbidden for developers', async () => {
    const res = await request(app).get('/api/audit-log').set('x-user-id', 'u-nina');
    expect(res.status).toBe(403);
  });

  // NOTE: rejecting access is NOT yet asserted to write an audit event.
  // (Consistency gap — a workshop task.)
});
