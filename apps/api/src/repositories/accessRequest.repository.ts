import { prisma } from '../db';

export interface AccessRequestFilter {
  status?: string;
  serviceId?: string;
  requesterUserId?: string;
}

export const accessRequestRepository = {
  create(data: { serviceId: string; requesterUserId: string; reason: string }) {
    return prisma.accessRequest.create({
      data: { ...data, status: 'pending' },
    });
  },

  findById(id: string) {
    return prisma.accessRequest.findUnique({
      where: { id },
      include: { service: { include: { ownerTeam: true } }, requester: true },
    });
  },

  findAll(filter: AccessRequestFilter = {}) {
    return prisma.accessRequest.findMany({
      where: {
        status: filter.status,
        serviceId: filter.serviceId,
        requesterUserId: filter.requesterUserId,
      },
      include: { service: true, requester: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  update(
    id: string,
    data: {
      status?: string;
      reviewedById?: string;
      reviewedAt?: Date;
      rejectionReason?: string | null;
    },
  ) {
    return prisma.accessRequest.update({ where: { id }, data });
  },
};
