import { apiFetch } from './client';
import type { ApiKey, UsageSummaryRow, AuditLog } from '../types';

export function fetchApiKeys(): Promise<ApiKey[]> {
  return apiFetch<ApiKey[]>('/api/api-keys');
}

export function revokeApiKey(id: string): Promise<ApiKey> {
  return apiFetch<ApiKey>(`/api/api-keys/${id}/revoke`, { method: 'POST' });
}

export function fetchUsageSummary(): Promise<UsageSummaryRow[]> {
  return apiFetch<UsageSummaryRow[]>('/api/usage/summary');
}

export function fetchAuditLog(): Promise<AuditLog[]> {
  return apiFetch<AuditLog[]>('/api/audit-log');
}
