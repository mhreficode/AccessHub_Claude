/**
 * Seed script for AccessHub.
 *
 * Creates a deterministic dataset (fixed ids) so the workshop can be reset to a
 * known state. Run with:  npm run db:seed
 */
import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Keep this in sync with apps/api/src/utils/crypto.ts (sha256 hex of the raw key).
function hashKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function clearAll(): Promise<void> {
  // Delete in FK-safe order.
  await prisma.auditLog.deleteMany();
  await prisma.usageEvent.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.accessRequest.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
}

async function main(): Promise<void> {
  await clearAll();

  // --- Teams -----------------------------------------------------------------
  await prisma.team.createMany({
    data: [
      { id: 'team-platform', name: 'Platform Team', slug: 'platform' },
      { id: 'team-payments', name: 'Payments Team', slug: 'payments' },
      { id: 'team-identity', name: 'Identity Team', slug: 'identity' },
      { id: 'team-data', name: 'Data Team', slug: 'data' },
    ],
  });

  // --- Users -----------------------------------------------------------------
  await prisma.user.createMany({
    data: [
      { id: 'user-alice', name: 'Alice Admin', email: 'alice@accesshub.dev', role: 'platform_admin', teamId: 'team-platform' },
      { id: 'user-omar', name: 'Omar Owner', email: 'omar@accesshub.dev', role: 'service_owner', teamId: 'team-payments' },
      { id: 'user-sara', name: 'Sara Owner', email: 'sara@accesshub.dev', role: 'service_owner', teamId: 'team-identity' },
      { id: 'user-nina', name: 'Nina Developer', email: 'nina@accesshub.dev', role: 'developer', teamId: 'team-data' },
      { id: 'user-leo', name: 'Leo Developer', email: 'leo@accesshub.dev', role: 'developer', teamId: 'team-data' },
    ],
  });

  // --- Services --------------------------------------------------------------
  const paymentsDocs = [
    '# Payments API',
    '',
    'Processes charges, refunds and payouts for internal services.',
    '',
    '## Endpoints',
    '- `POST /v2/charges` — create a charge',
    '- `POST /v2/refunds` — refund a charge',
    '',
    '> Note: rate limited to 100 req/min per key.',
  ].join('\n');

  // Issue #8 (outdated docs): mentions an old endpoint path that no longer exists.
  const identityDocs = [
    '# Identity API',
    '',
    'User identity, profile and group membership lookups.',
    '',
    '## Endpoints',
    '- `GET /v1/userinfo` — DEPRECATED, use `/v2/users/{id}` instead',
    '- `GET /v2/users/{id}` — fetch a user',
  ].join('\n');

  // Issue #9 (unsafe markdown): docs contain raw HTML that the frontend renders verbatim.
  const notificationsDocs = [
    '# Notifications API',
    '',
    'Send transactional email, SMS and push notifications.',
    '',
    '<div class="callout">Raw HTML is allowed in service docs today. This should be sanitized.</div>',
    '',
    '## Endpoints',
    '- `POST /v1/notify` — send a notification',
  ].join('\n');

  await prisma.service.createMany({
    data: [
      { id: 'svc-payments', name: 'Payments API', slug: 'payments-api', description: 'Charges, refunds and payouts.', status: 'active', baseUrl: 'https://payments.internal.accesshub.dev', docsMarkdown: paymentsDocs, ownerTeamId: 'team-payments' },
      { id: 'svc-identity', name: 'Identity API', slug: 'identity-api', description: 'User identity and group lookups.', status: 'active', baseUrl: 'https://identity.internal.accesshub.dev', docsMarkdown: identityDocs, ownerTeamId: 'team-identity' },
      { id: 'svc-notifications', name: 'Notifications API', slug: 'notifications-api', description: 'Email, SMS and push notifications.', status: 'active', baseUrl: 'https://notify.internal.accesshub.dev', docsMarkdown: notificationsDocs, ownerTeamId: 'team-platform' },
      { id: 'svc-analytics', name: 'Analytics API', slug: 'analytics-api', description: 'Event and product analytics.', status: 'maintenance', baseUrl: 'https://analytics.internal.accesshub.dev', docsMarkdown: '# Analytics API\n\nProduct and event analytics queries.', ownerTeamId: 'team-data' },
      { id: 'svc-inventory', name: 'Inventory API', slug: 'inventory-api', description: 'Stock levels and warehouses.', status: 'deprecated', baseUrl: 'https://inventory.internal.accesshub.dev', docsMarkdown: '# Inventory API\n\nDeprecated. Use Payments API stock hooks.', ownerTeamId: 'team-platform' },
      { id: 'svc-search', name: 'Search API', slug: 'search-api', description: 'Full-text search across catalogs.', status: 'active', baseUrl: 'https://search.internal.accesshub.dev', docsMarkdown: '# Search API\n\nFull-text search over internal catalogs.', ownerTeamId: 'team-data' },
    ],
  });

  // --- Access requests: 2 pending, 2 approved, 1 rejected --------------------
  await prisma.accessRequest.createMany({
    data: [
      { id: 'req-1', serviceId: 'svc-payments', requesterUserId: 'user-nina', reason: 'Need to reconcile charges for the data warehouse.', status: 'pending', createdAt: daysAgo(2) },
      { id: 'req-2', serviceId: 'svc-identity', requesterUserId: 'user-leo', reason: 'Building an internal org chart tool.', status: 'pending', createdAt: daysAgo(1) },
      { id: 'req-3', serviceId: 'svc-payments', requesterUserId: 'user-leo', reason: 'Payout dashboard prototype.', status: 'approved', reviewedById: 'user-omar', reviewedAt: daysAgo(10), createdAt: daysAgo(12) },
      { id: 'req-4', serviceId: 'svc-identity', requesterUserId: 'user-nina', reason: 'User profile widget.', status: 'approved', reviewedById: 'user-sara', reviewedAt: daysAgo(40), createdAt: daysAgo(42) },
      { id: 'req-5', serviceId: 'svc-analytics', requesterUserId: 'user-nina', reason: 'Ad-hoc analytics export.', status: 'rejected', reviewedById: 'user-alice', reviewedAt: daysAgo(5), rejectionReason: 'Use the shared analytics dashboard instead.', createdAt: daysAgo(6) },
    ],
  });

  // --- API keys: 2 active, 1 revoked -----------------------------------------
  await prisma.apiKey.createMany({
    data: [
      { id: 'key-1', serviceId: 'svc-payments', userId: 'user-leo', keyPrefix: 'ah_live_lP', keyHash: hashKey('ah_live_lP_seed_payments_leo'), label: 'Payout dashboard', status: 'active', createdAt: daysAgo(10), lastUsedAt: daysAgo(1) },
      { id: 'key-2', serviceId: 'svc-identity', userId: 'user-nina', keyPrefix: 'ah_live_nI', keyHash: hashKey('ah_live_nI_seed_identity_nina'), label: 'Profile widget', status: 'active', createdAt: daysAgo(40), lastUsedAt: daysAgo(3) },
      { id: 'key-3', serviceId: 'svc-payments', userId: 'user-nina', keyPrefix: 'ah_live_oR', keyHash: hashKey('ah_live_oR_seed_old_revoked'), label: 'Old import job', status: 'revoked', createdAt: daysAgo(60), revokedAt: daysAgo(20), lastUsedAt: daysAgo(25) },
    ],
  });

  // --- Usage events ----------------------------------------------------------
  const services = ['svc-payments', 'svc-identity', 'svc-notifications', 'svc-analytics', 'svc-search'];
  const endpoints = ['/v2/charges', '/v2/users/abc', '/v1/notify', '/query', '/search'];
  const usage = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < 240; i++) {
    const svc = services[i % services.length];
    const ok = rand() > 0.18;
    usage.push({
      serviceId: svc,
      apiKeyId: svc === 'svc-payments' ? 'key-1' : svc === 'svc-identity' ? 'key-2' : null,
      endpoint: endpoints[i % endpoints.length],
      statusCode: ok ? 200 : rand() > 0.5 ? 429 : 500,
      latencyMs: 20 + Math.floor(rand() * 400),
      success: ok,
      timestamp: daysAgo(Math.floor(rand() * 14)),
    });
  }
  await prisma.usageEvent.createMany({ data: usage });

  // --- Audit logs ------------------------------------------------------------
  await prisma.auditLog.createMany({
    data: [
      { actorUserId: 'user-omar', action: 'access.approved', entityType: 'AccessRequest', entityId: 'req-3', message: 'Omar Owner approved access to Payments API for Leo Developer.', metadata: JSON.stringify({}), createdAt: daysAgo(10) },
      { actorUserId: 'user-omar', action: 'apikey.generated', entityType: 'ApiKey', entityId: 'key-1', message: 'API key generated for Payments API.', metadata: JSON.stringify({ keyPrefix: 'ah_live_lP' }), createdAt: daysAgo(10) },
      { actorUserId: 'user-nina', action: 'apikey.revoked', entityType: 'ApiKey', entityId: 'key-3', message: 'API key revoked for Payments API.', metadata: JSON.stringify({ keyPrefix: 'ah_live_oR' }), createdAt: daysAgo(20) },
      { actorUserId: 'user-alice', action: 'service.updated', entityType: 'Service', entityId: 'svc-inventory', message: 'Inventory API marked deprecated.', metadata: JSON.stringify({}), createdAt: daysAgo(15) },
    ],
  });

  const counts = {
    teams: await prisma.team.count(),
    users: await prisma.user.count(),
    services: await prisma.service.count(),
    accessRequests: await prisma.accessRequest.count(),
    apiKeys: await prisma.apiKey.count(),
    usageEvents: await prisma.usageEvent.count(),
    auditLogs: await prisma.auditLog.count(),
  };
  console.log('Seed complete:', counts);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
