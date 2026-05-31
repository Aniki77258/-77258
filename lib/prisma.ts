import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createSafePrisma(): PrismaClient {
  try {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
    return client
  } catch (err: any) {
    console.warn("[Prisma] Client initialization failed (expected on serverless without DB):", err.message)
    // Return a proxy that silently fails on DB operations
    // All data-service functions have try-catch + mock fallback
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "$connect" || prop === "$disconnect") {
          return () => Promise.resolve()
        }
        if (prop === "$transaction") {
          return () => Promise.resolve([])
        }
        // For model accessors (candidate, user, etc.)
        return new Proxy({}, {
          get(_m, method) {
            return () => Promise.resolve(null)
          },
        })
      },
    })
  }
}

export const prisma = globalForPrisma.prisma || createSafePrisma()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
