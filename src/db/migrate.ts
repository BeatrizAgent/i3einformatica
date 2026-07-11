import { migrate } from "drizzle-orm/node-postgres/migrator";
import { loadEnvConfig } from "@next/env";

import { closeDb, getDb } from "./index";

loadEnvConfig(process.cwd());

export async function migrateDatabase(): Promise<void> {
  await migrate(getDb(), { migrationsFolder: "src/db/migrations" });
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/src/db/migrate.ts")) {
  migrateDatabase()
    .then(() => console.info("Database migrations complete"))
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(closeDb);
}
