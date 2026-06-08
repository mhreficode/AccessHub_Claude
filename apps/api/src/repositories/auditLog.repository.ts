import { prisma } from '../db';

export interface AuditLogInput {
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export const auditLogRepository = {
  create(input: AuditLogInput) {
    return prisma.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        message: input.message,
        metadata: JSON.stringify(input.metadata ?? {}),
      },
    });
  },

  findAll(limit = 100) {
    return prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  },
};
