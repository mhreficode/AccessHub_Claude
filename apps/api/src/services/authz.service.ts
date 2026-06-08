import { forbidden } from '../utils/errors';

/**
 * Authorization rules for AccessHub. See docs/DOMAIN_RULES.md.
 *
 * These helpers are the single source of truth for "who can do what". Routes and
 * services should call the assert* helpers rather than re-checking roles inline.
 *
 * Workshop note: not every service uses these helpers consistently yet.
 */

export interface AuthUser {
  id: string;
  role: string;
  teamId: string | null;
}

export interface OwnedEntity {
  ownerTeamId: string;
}

export const isAdmin = (user: AuthUser): boolean => user.role === 'platform_admin';
export const isServiceOwner = (user: AuthUser): boolean => user.role === 'service_owner';
export const isDeveloper = (user: AuthUser): boolean => user.role === 'developer';

/** True if the user can manage (and review requests for) the given service/team. */
export function canManageService(user: AuthUser, service: OwnedEntity): boolean {
  if (isAdmin(user)) return true;
  return isServiceOwner(user) && user.teamId === service.ownerTeamId;
}

/** True if the user may revoke the given key (admin, owning team, or the key holder). */
export function canRevokeKey(
  user: AuthUser,
  key: { userId: string; service: OwnedEntity },
): boolean {
  if (isAdmin(user)) return true;
  if (key.userId === user.id) return true;
  return isServiceOwner(user) && user.teamId === key.service.ownerTeamId;
}

export function assertCanManageService(user: AuthUser, service: OwnedEntity): void {
  if (!canManageService(user, service)) {
    throw forbidden('Only the owning team or a platform admin can manage this service.');
  }
}

export function assertCanRevokeKey(
  user: AuthUser,
  key: { userId: string; service: OwnedEntity },
): void {
  if (!canRevokeKey(user, key)) {
    throw forbidden('You are not allowed to revoke this API key.');
  }
}
