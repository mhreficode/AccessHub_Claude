import { describe, expect, it } from 'vitest';
import { canManageService, canRevokeKey, type AuthUser } from '../services/authz.service';

const admin: AuthUser = { id: 'u-alice', role: 'platform_admin', teamId: 'team-platform' };
const paymentsOwner: AuthUser = { id: 'u-omar', role: 'service_owner', teamId: 'team-payments' };
const platformOwner: AuthUser = { id: 'u-sara', role: 'service_owner', teamId: 'team-platform' };
const developer: AuthUser = { id: 'u-nina', role: 'developer', teamId: 'team-payments' };

const paymentsService = { ownerTeamId: 'team-payments' };

describe('canManageService', () => {
  it('allows platform admins', () => {
    expect(canManageService(admin, paymentsService)).toBe(true);
  });

  it('allows the owning team', () => {
    expect(canManageService(paymentsOwner, paymentsService)).toBe(true);
  });

  it('rejects owners from other teams', () => {
    expect(canManageService(platformOwner, paymentsService)).toBe(false);
  });

  it('rejects developers', () => {
    expect(canManageService(developer, paymentsService)).toBe(false);
  });
});

describe('canRevokeKey', () => {
  const key = { userId: 'u-nina', service: { ownerTeamId: 'team-payments' } };

  it('allows the key holder', () => {
    expect(canRevokeKey(developer, key)).toBe(true);
  });

  it('allows the owning team', () => {
    expect(canRevokeKey(paymentsOwner, key)).toBe(true);
  });

  it('rejects unrelated owners', () => {
    expect(canRevokeKey(platformOwner, key)).toBe(false);
  });
});
