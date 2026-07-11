import { loadEnvConfig } from "@next/env";
import { and, eq } from "drizzle-orm";

import { closeDb, getDb } from "../src/db";
import { getPageDocument, type ContentLocale } from "../src/lib/page-content";
import { pageSectionTranslations, pageSections, pageTranslations, pages, type Locale } from "../src/db/schema";

loadEnvConfig(process.cwd());

const locales = ["es", "en"] as const satisfies readonly ContentLocale[];
const pageIds = [
  "home", "microsoft-365", "microsoft-365-products", "microsoft-365-solutions", "cybersecurity", "microsoft-azure",
  "it-infrastructure", "compliance", "success-stories", "about-us", "contact", "join-team", "complaints",
  "privacy-policy", "cookie-policy", "legal-notice",
];

function pageType(pageId: string): "landing" | "legal" | "listing" | "form" {
  if (["privacy-policy", "cookie-policy", "legal-notice"].includes(pageId)) return "legal";
  if (["contact", "join-team", "complaints"].includes(pageId)) return "form";
  if (pageId === "success-stories") return "listing";
  return "landing";
}

function titleFor(document: ReturnType<typeof getPageDocument>, locale: ContentLocale) {
  if (!document) throw new Error("Missing curated document");
  return document.locales[locale].hero.title;
}

async function run() {
  const validateOnly = !process.argv.includes("--apply");
  const db = validateOnly ? null : getDb();
  for (const pageId of pageIds) {
    const document = getPageDocument(pageId);
    if (!document) throw new Error(`Missing curated page ${pageId}`);
    for (const locale of locales) {
      const content = document.locales[locale];
      const payload = { schemaVersion: 2, family: document.family, templateVariant: document.templateVariant, hero: content.hero, blocks: content.blocks, cta: content.cta ?? null, assets: document.assets };
      if (validateOnly) continue;
      if (!db) continue;
      await db.transaction(async (tx) => {
        const [page] = await tx.insert(pages).values({ key: pageId, type: pageType(pageId), config: { family: document.family, templateVariant: document.templateVariant } }).onConflictDoUpdate({ target: pages.key, set: { type: pageType(pageId), config: { family: document.family, templateVariant: document.templateVariant }, active: true, updatedAt: new Date() } }).returning();
        if (!page) throw new Error(`Could not upsert page ${pageId}`);
        await tx.insert(pageTranslations).values({ pageId: page.id, locale: locale as Locale, localizedPath: content.path, title: titleFor(document, locale), excerpt: content.hero.intro, seoTitle: content.seo.title, seoDescription: content.seo.description, content: payload, status: document.editorialStatus, translatorType: "human", sourceRevision: page.sourceRevision }).onConflictDoUpdate({ target: [pageTranslations.pageId, pageTranslations.locale], set: { localizedPath: content.path, title: titleFor(document, locale), excerpt: content.hero.intro, seoTitle: content.seo.title, seoDescription: content.seo.description, content: payload, status: document.editorialStatus, translatorType: "human", sourceRevision: page.sourceRevision, updatedAt: new Date() } });
        await tx.update(pageSections).set({ active: false, updatedAt: new Date() }).where(and(eq(pageSections.pageId, page.id), eq(pageSections.key, "migrated-content")));
        for (const [position, block] of content.blocks.entries()) {
          const [section] = await tx.insert(pageSections).values({ pageId: page.id, key: block.id, componentType: block.type, position, config: { schemaVersion: 2 }, schema: { type: block.type } }).onConflictDoUpdate({ target: [pageSections.pageId, pageSections.key], set: { componentType: block.type, position, config: { schemaVersion: 2 }, schema: { type: block.type }, active: true, updatedAt: new Date() } }).returning();
          if (!section) throw new Error(`Could not upsert section ${pageId}:${block.id}`);
          await tx.insert(pageSectionTranslations).values({ pageSectionId: section.id, locale: locale as Locale, content: block, status: document.editorialStatus, translatorType: "human", sourceRevision: page.sourceRevision }).onConflictDoUpdate({ target: [pageSectionTranslations.pageSectionId, pageSectionTranslations.locale], set: { content: block, status: document.editorialStatus, translatorType: "human", sourceRevision: page.sourceRevision, updatedAt: new Date() } });
        }
      });
    }
  }
  console.info(validateOnly ? `Curated content import validated: ${pageIds.length} pages × ${locales.length} locales; no database writes.` : `Curated content imported: ${pageIds.length} pages × ${locales.length} locales.`);
}

run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
}).finally(closeDb);
