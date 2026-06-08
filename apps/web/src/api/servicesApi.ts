import { apiFetch } from './client';
import type { Service } from '../types';

export function fetchServices(params: { status?: string; search?: string } = {}): Promise<Service[]> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  const qs = query.toString();
  return apiFetch<Service[]>(`/api/services${qs ? `?${qs}` : ''}`);
}

export function fetchService(id: string): Promise<Service> {
  return apiFetch<Service>(`/api/services/${id}`);
}

export function requestAccess(serviceId: string, reason: string): Promise<unknown> {
  return apiFetch(`/api/services/${serviceId}/access-requests`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}
