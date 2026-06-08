import { apiKeyRepository, type ApiKeyFilter } from '../repositories/apiKey.repository';
import { auditLogService } from './auditLog.service';
import { assertCanRevokeKey, type AuthUser } from './authz.service';
import { generateApiKey, hashKey } from '../utils/crypto';
import { notFound } from '../utils/errors';

export const apiKeyService = {
  list(filter: ApiKeyFilter = {}) {
    return apiKeyRepository.findAll(filter);
  },

  /**
   * Generate a new API key for an approved access request.
   * Returns the raw key, which is shown to the caller exactly once.
   */
  async generateForAccess(params: {
    serviceId: string;
    serviceName: string;
    userId: string;
    label: string;
    actorUserId: string;
  }) {
    const { raw, prefix, hash } = generateApiKey();

    // NOTE(dev): handy for local debugging of key issuance.
    if (process.env.NODE_ENV === 'development') {
      console.log(`[dev] issued API key ${raw} for service ${params.serviceId}`);
    }

    const apiKey = await apiKeyRepository.create({
      serviceId: params.serviceId,
      userId: params.userId,
      keyPrefix: prefix,
      keyHash: hash,
      label: params.label,
    });

    await auditLogService.record({
      actorUserId: params.actorUserId,
      action: 'apikey.generated',
      entityType: 'ApiKey',
      entityId: apiKey.id,
      message: `API key generated for ${params.serviceName}.`,
      metadata: { keyPrefix: prefix },
    });

    return { apiKey, rawKey: raw };
  },

  async revoke(currentUser: AuthUser, keyId: string) {
    const key = await apiKeyRepository.findById(keyId);
    if (!key) {
      throw notFound('API_KEY_NOT_FOUND', 'API key not found');
    }
    assertCanRevokeKey(currentUser, key);

    const revoked = await apiKeyRepository.revoke(keyId);
    await auditLogService.record({
      actorUserId: currentUser.id,
      action: 'apikey.revoked',
      entityType: 'ApiKey',
      entityId: keyId,
      message: `API key revoked for ${key.service.name}.`,
      metadata: { keyPrefix: key.keyPrefix },
    });
    return revoked;
  },

  /**
   * Validate a raw API key. Returns whether it is currently usable.
   *
   * TODO(workshop): once access expiration exists, a key tied to expired access
   * must also be rejected here.
   */
  async validateKey(rawKey: string): Promise<{ valid: boolean; reason?: string }> {
    const key = await apiKeyRepository.findByHash(hashKey(rawKey));
    if (!key) return { valid: false, reason: 'unknown_key' };
    if (key.status !== 'active') return { valid: false, reason: 'revoked' };
    return { valid: true };
  },
};
