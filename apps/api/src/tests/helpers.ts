import { createHash } from 'node:crypto';
import { prisma } from '../db';

function hashKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

/**
 * Wipe and reseed a small, deterministic fixture set before each test.
 * Returns the well-known ids so tests can reference them.
 */
export async function resetDb() {
  await prisma.auditLog.deleteMany();
  await prisma.usageEvent.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.accessRequest.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();

  await prisma.team.createMany({
    data: [
      { id: 'team-platform', name: 'Platform Team', slug: 'platform' },
      { id: 'team-payments', name: 'Payments Team', slug: 'payments' },
    ],
  });

  await prisma.user.createMany({
    data: [
      { id: 'u-alice', name: 'Alice Admin', email: 'alice@test.dev', role: 'platform_admin', teamId: 'team-platform' },
      { id: 'u-omar', name: 'Omar Owner', email: 'omar@test.dev', role: 'service_owner', teamId: 'team-payments' },
      { id: 'u-sara', name: 'Sara Owner', email: 'sara@test.dev', role: 'service_owner', teamId: 'team-platform' },
      { id: 'u-nina', name: 'Nina Developer', email: 'nina@test.dev', role: 'developer', teamId: 'team-payments' },
    ],
  });

  await prisma.service.createMany({
    data: [
      { id: 'svc-payments', name: 'Payments API', slug: 'payments-api', description: 'Payments.', status: 'active', baseUrl: 'https://pay.test', docsMarkdown: '# Payments', ownerTeamId: 'team-payments' },
      { id: 'svc-notify', name: 'Notifications API', slug: 'notifications-api', description: 'Notify.', status: 'active', baseUrl: 'https://notify.test', docsMarkdown: '# Notify', ownerTeamId: 'team-platform' },
    ],
  });

  await prisma.accessRequest.createMany({
    data: [
      { id: 'req-pending', serviceId: 'svc-payments', requesterUserId: 'u-nina', reason: 'Need access for reporting work.', status: 'pending' },
      { id: 'req-approved', serviceId: 'svc-payments', requesterUserId: 'u-nina', reason: 'Already approved request.', status: 'approved', reviewedById: 'u-omar', reviewedAt: new Date() },
    ],
  });

  await prisma.apiKey.createMany({
    data: [
      { id: 'key-active', serviceId: 'svc-payments', userId: 'u-nina', keyPrefix: 'ah_live_aA', keyHash: hashKey('ah_live_aA_active'), label: 'Active key', status: 'active' },
      { id: 'key-revoked', serviceId: 'svc-payments', userId: 'u-nina', keyPrefix: 'ah_live_rR', keyHash: hashKey('ah_live_rR_revoked'), label: 'Revoked key', status: 'revoked', revokedAt: new Date() },
    ],
  });

  await prisma.usageEvent.createMany({
    data: [
      { serviceId: 'svc-payments', apiKeyId: 'key-active', endpoint: '/v2/charges', statusCode: 200, latencyMs: 50, success: true },
      { serviceId: 'svc-payments', apiKeyId: 'key-active', endpoint: '/v2/charges', statusCode: 500, latencyMs: 90, success: false },
      { serviceId: 'svc-payments', apiKeyId: 'key-active', endpoint: '/v2/charges', statusCode: 429, latencyMs: 20, success: false },
    ],
  });

  return {
    raw: { activeKey: 'ah_live_aA_active', revokedKey: 'ah_live_rR_revoked' },
  };
}

export { prisma };
