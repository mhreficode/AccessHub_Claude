import { prisma } from '../db';

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, include: { team: true } });
  },
  findAll() {
    return prisma.user.findMany({ include: { team: true }, orderBy: { name: 'asc' } });
  },
};
