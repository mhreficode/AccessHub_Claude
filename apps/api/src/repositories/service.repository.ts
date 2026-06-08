import { prisma } from '../db';

export interface ServiceFilter {
  status?: string;
  tag?: string;
  ownerTeamId?: string;
  search?: string;
}

export const serviceRepository = {
  findAll(filter: ServiceFilter = {}) {
    return prisma.service.findMany({
      where: {
        status: filter.status,
        ownerTeamId: filter.ownerTeamId,
        ...(filter.search
          ? { OR: [{ name: { contains: filter.search } }, { description: { contains: filter.search } }] }
          : {}),
      },
      include: { ownerTeam: true },
      orderBy: { name: 'asc' },
    });
  },

  findById(id: string) {
    return prisma.service.findUnique({ where: { id }, include: { ownerTeam: true } });
  },

  findBySlug(slug: string) {
    return prisma.service.findUnique({ where: { slug }, include: { ownerTeam: true } });
  },

  update(id: string, data: { status?: string; description?: string; docsMarkdown?: string }) {
    return prisma.service.update({ where: { id }, data });
  },
};
