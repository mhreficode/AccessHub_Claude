import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { resetDb, prisma } from './helpers';

const app = createApp();

beforeEach(async () => {
  await resetDb();
});

describe('GET /api/services', () => {
  it('lists seeded services', async () => {
    const res = await request(app).get('/api/services').set('x-user-id', 'u-nina');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.map((s: { slug: string }) => s.slug)).toContain('payments-api');
  });

  it('requires an identified user', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('filters by status', async () => {
    const res = await request(app)
      .get('/api/services?status=active')
      .set('x-user-id', 'u-nina');
    expect(res.status).toBe(200);
    expect(res.body.every((s: { status: string }) => s.status === 'active')).toBe(true);
  });
});

describe('GET /api/services/:id', () => {
  it('returns a service by id', async () => {
    const res = await request(app).get('/api/services/svc-payments').set('x-user-id', 'u-nina');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Payments API');
  });

  it('returns 404 for an unknown service', async () => {
    const res = await request(app).get('/api/services/nope').set('x-user-id', 'u-nina');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/services/:id/access-requests', () => {
  it('creates a pending access request', async () => {
    const res = await request(app)
      .post('/api/services/svc-notify/access-requests')
      .set('x-user-id', 'u-nina')
      .send({ reason: 'I need to send notifications from my app.' });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');

    const count = await prisma.accessRequest.count({ where: { serviceId: 'svc-notify' } });
    expect(count).toBe(1);
  });

  it('rejects a too-short reason', async () => {
    const res = await request(app)
      .post('/api/services/svc-notify/access-requests')
      .set('x-user-id', 'u-nina')
      .send({ reason: 'too short' });
    expect(res.status).toBe(400);
  });
});
