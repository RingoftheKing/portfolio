import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({} as any);
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection test successful');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

// Graceful shutdown
export const disconnect = async (): Promise<void> => {
  await prisma.$disconnect();
  console.log('Database connection closed');
};
