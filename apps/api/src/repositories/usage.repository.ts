import { prisma } from '../db';

export const usageRepository = {
  /**
   * Returns ALL usage events. This is used by the usage dashboard today.
   *
   * Workshop note (performance): aggregating these in memory does not scale.
   * A grouped query (see groupedByService) is the better approach.
   */
  findAll() {
    return prisma.usageEvent.findMany({ orderBy: { timestamp: 'desc' } });
  },

  findByService(serviceId: string) {
    return prisma.usageEvent.findMany({ where: { serviceId }, orderBy: { timestamp: 'desc' } });
  },

  // Provided but not yet wired into the summary endpoint.
  groupedByService() {
    return prisma.usageEvent.groupBy({
      by: ['serviceId'],
      _count: { _all: true },
      _avg: { latencyMs: true },
    });
  },
};
