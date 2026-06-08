import { apiFetch } from './client';
import type { AccessRequest } from '../types';

export function fetchAccessRequests(status?: string): Promise<AccessRequest[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiFetch<AccessRequest[]>(`/api/access-requests${qs}`);
}

export interface ApproveResult {
  request: AccessRequest;
  apiKey: { maskedKey: string; serviceName: string | null };
  rawKey: string;
}

export function approveRequest(id: string): Promise<ApproveResult> {
  return apiFetch<ApproveResult>(`/api/access-requests/${id}/approve`, { method: 'POST' });
}

export function rejectRequest(id: string, rejectionReason: string): Promise<AccessRequest> {
  return apiFetch<AccessRequest>(`/api/access-requests/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ rejectionReason }),
  });
}
