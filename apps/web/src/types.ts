export type Role = 'developer' | 'service_owner' | 'platform_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  team?: string | null;
  teamId?: string | null;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: 'active' | 'deprecated' | 'maintenance';
  baseUrl: string;
  docsMarkdown: string;
  ownerTeamId: string;
  ownerTeam?: { id: string; name: string } | null;
}

export interface AccessRequest {
  id: string;
  serviceId: string;
  requesterUserId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedById?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  service?: Service;
  requester?: User;
}

export interface ApiKey {
  id: string;
  serviceId: string;
  serviceName: string | null;
  userId: string;
  label: string;
  maskedKey: string;
  status: 'active' | 'revoked';
  createdAt: string;
  revokedAt?: string | null;
  lastUsedAt?: string | null;
}

export interface UsageSummaryRow {
  serviceId: string;
  total: number;
  failed: number;
  avgLatencyMs: number;
  rateLimited: number;
  rateLimitWarning: boolean;
}

export interface AuditLog {
  id: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  message: string;
  createdAt: string;
}
