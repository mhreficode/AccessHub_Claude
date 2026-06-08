import type { ApiKey, Role, User } from '../types';

/**
 * Frontend permission helpers. These decide which buttons/tabs to show.
 *
 * IMPORTANT: these are convenience checks for the UI only. The backend must
 * enforce the real authorization rules — never rely on these for security.
 */

const PRIVILEGED: Role[] = ['service_owner', 'platform_admin'];

export function canApproveRequests(user: User | null): boolean {
  return !!user && PRIVILEGED.includes(user.role);
}

export function canViewAuditLog(user: User | null): boolean {
  return !!user && PRIVILEGED.includes(user.role);
}

export function canManageServices(user: User | null): boolean {
  return !!user && PRIVILEGED.includes(user.role);
}

export function canRevokeKey(user: User | null, key: ApiKey): boolean {
  if (!user) return false;
  if (user.role === 'platform_admin') return true;
  if (key.userId === user.id) return true;
  return user.role === 'service_owner';
}
