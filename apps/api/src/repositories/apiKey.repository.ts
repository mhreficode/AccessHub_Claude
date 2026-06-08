import { prisma } from '../db';

export interface ApiKeyFilter {
  userId?: string;
  serviceId?: string;
  status?: string;
}

export const apiKeyRepository = {
  create(data: {
    serviceId: string;
    userId: string;
    keyPrefix: string;
    keyHash: string;
    label: string;
  }) {
    return prisma.apiKey.create({ data: { ...data, status: 'active' } });
  },

  findById(id: string) {
    return prisma.apiKey.findUnique({ where: { id }, include: { service: true, user: true } });
  },

  findByHash(keyHash: string) {
    return prisma.apiKey.findFirst({ where: { keyHash } });
  },

  findAll(filter: ApiKeyFilter = {}) {
    return prisma.apiKey.findMany({
      where: { userId: filter.userId, serviceId: filter.serviceId, status: filter.status },
      include: { service: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  revoke(id: string) {
    return prisma.apiKey.update({
      where: { id },
      data: { status: 'revoked', revokedAt: new Date() },
    });
  },
};
