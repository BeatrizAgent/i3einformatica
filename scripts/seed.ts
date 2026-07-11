import { closeDb, getDb } from "../src/db";
import { siteSettings, users } from "../src/db/schema";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function seed(): Promise<void> {
  const db = getDb();

  await db
    .insert(siteSettings)
    .values([
      { key: "site", value: { name: "i3e Informática", defaultLocale: "es" } },
      { key: "translation", value: { provider: "openai", autoPublish: false } },
    ])
    .onConflictDoUpdate({ target: siteSettings.key, set: { updatedAt: new Date() } });

  const subject = process.env.SEED_ADMIN_OIDC_SUBJECT;
  const email = process.env.SEED_ADMIN_EMAIL;
  if (subject && email) {
    await db
      .insert(users)
      .values({ oidcSubject: subject, email, displayName: process.env.SEED_ADMIN_NAME ?? "Administrator", role: "admin" })
      .onConflictDoUpdate({
        target: users.oidcSubject,
        set: { email, displayName: process.env.SEED_ADMIN_NAME ?? "Administrator", role: "admin", active: true, updatedAt: new Date() },
      });
  }
}

seed()
  .then(() => console.info("Seed complete"))
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(closeDb);
