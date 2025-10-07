import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a single instance of PrismaClient or use the existing one from the global object
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Optional: Log all queries to the console in development
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// In development, store the instance on the global object to prevent multiple instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
