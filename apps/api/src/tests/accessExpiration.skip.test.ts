import { describe, it } from 'vitest';

/**
 * Tests for the "Expiring Service Access" feature.
 *
 * These are intentionally skipped. They define the behaviour participants should
 * implement during the workshop. Remove `.skip` as each piece is built.
 *
 * See: specs/access-expiration/ and docs/PRD.md.
 */
describe('Expiring Service Access', () => {
  it.skip('marks approved access as expired after 30 days', async () => {
    // Given a developer has approved access to a service
    // When 30 days have passed since approval
    // Then the access should be reported as expired
  });

  it.skip('revokes/invalidates API keys for expired access', async () => {
    // Given an access request has expired
    // Then validateKey() must reject keys tied to that access
  });

  it.skip('allows service owners to extend access', async () => {
    // Given an owner extends an expiring access request
    // Then the new expiry should be ~30 days out and an audit event recorded
  });

  it.skip('lists access that is expiring soon on the dashboard endpoint', async () => {
    // GET /api/access/expiring should return access expiring within N days
  });
});
