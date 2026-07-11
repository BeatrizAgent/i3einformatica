import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";
import * as relationDefinitions from "./relations";

const fullSchema = { ...schema, ...relationDefinitions };
type Database = ReturnType<typeof drizzle<typeof fullSchema>>;

const globalDatabase = globalThis as typeof globalThis & {
  __i3ePool?: Pool;
  __i3eDb?: Database;
};

export function getPool(): Pool {
  if (globalDatabase.__i3ePool) return globalDatabase.__i3ePool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required when opening a database connection");
  }

  const pool = new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  });

  globalDatabase.__i3ePool = pool;
  return pool;
}

export function getDb(): Database {
  if (!globalDatabase.__i3eDb) {
    globalDatabase.__i3eDb = drizzle(getPool(), { schema: fullSchema });
  }
  return globalDatabase.__i3eDb;
}

export async function closeDb(): Promise<void> {
  if (!globalDatabase.__i3ePool) return;
  await globalDatabase.__i3ePool.end();
  delete globalDatabase.__i3ePool;
  delete globalDatabase.__i3eDb;
}

export type { Database };
export * from "./relations";
export * from "./schema";
export * from "./translations";
