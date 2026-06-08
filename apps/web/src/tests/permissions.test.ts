import { describe, expect, it } from 'vitest';
import { canApproveRequests, canViewAuditLog, canRevokeKey } from '../utils/permissions';
import type { ApiKey, User } from '../types';

const developer: User = { id: 'u1', name: 'Dev', email: 'd@x.dev', role: 'developer' };
const owner: User = { id: 'u2', name: 'Own', email: 'o@x.dev', role: 'service_owner' };
const admin: User = { id: 'u3', name: 'Adm', email: 'a@x.dev', role: 'platform_admin' };

describe('canApproveRequests', () => {
  it('allows owners and admins', () => {
    expect(canApproveRequests(owner)).toBe(true);
    expect(canApproveRequests(admin)).toBe(true);
  });
  it('denies developers and anonymous', () => {
    expect(canApproveRequests(developer)).toBe(false);
    expect(canApproveRequests(null)).toBe(false);
  });
});

describe('canViewAuditLog', () => {
  it('denies developers', () => {
    expect(canViewAuditLog(developer)).toBe(false);
  });
});

describe('canRevokeKey', () => {
  const key: ApiKey = {
    id: 'k1',
    serviceId: 's1',
    serviceName: 'S',
    userId: 'u1',
    label: 'L',
    maskedKey: 'ah_live_xx••••••••',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  it('allows the key holder', () => {
    expect(canRevokeKey(developer, key)).toBe(true);
  });
  it('allows admins', () => {
    expect(canRevokeKey(admin, key)).toBe(true);
  });
});
