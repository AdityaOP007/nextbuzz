import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function logDatabaseConnection(): Promise<string> {
  const maskedUrl = (process.env.DATABASE_URL || "").replace(/:([^:@]+)@/, ":****@");
  console.log("DATABASE_URL loaded:", maskedUrl);

  const result = await prisma.$queryRaw<Array<{ current_database: string }>>`
    SELECT current_database()
  `;
  const database = result[0]?.current_database ?? "unknown";
  console.log("Prisma connected to database:", database);
  return database;
}
