import { PrismaClient } from '@prisma/client';

/**
 * Single shared Prisma client for the API process.
 * The datasource URL is read from DATABASE_URL (see .env / prisma/schema.prisma).
 */
export const prisma = new PrismaClient();
