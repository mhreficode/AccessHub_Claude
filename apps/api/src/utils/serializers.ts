import { maskKey } from './crypto';

interface ApiKeyRecord {
  id: string;
  serviceId: string;
  userId: string;
  keyPrefix: string;
  keyHash: string;
  label: string;
  status: string;
  createdAt: Date;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
  service?: { name: string } | null;
}

/**
 * Serialize an API key for API responses.
 * The keyHash is never included; only a masked prefix is exposed.
 */
export function serializeApiKey(key: ApiKeyRecord) {
  return {
    id: key.id,
    serviceId: key.serviceId,
    serviceName: key.service?.name ?? null,
    userId: key.userId,
    label: key.label,
    maskedKey: maskKey(key.keyPrefix),
    status: key.status,
    createdAt: key.createdAt,
    revokedAt: key.revokedAt,
    lastUsedAt: key.lastUsedAt,
  };
}
