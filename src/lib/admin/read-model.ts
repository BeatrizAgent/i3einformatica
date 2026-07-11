import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { pages, pageTranslations } from "@/db/schema";
import { getEquivalent, locales, publishedPages } from "@/lib/content/repository";

export async function getAdminMatrix() {
  if (!process.env.DATABASE_URL) {
    return publishedPages.filter((page) => page.locale === "es").map((page) => ({ id: page.id, title: page.title, sourceRevision: 1, paths: { es: page.path, en: getEquivalent(page.id, "en")?.path ?? "" } as Record<string, string>, translationIds: {} as Record<string, string>, locales: Object.fromEntries(locales.map((locale) => [locale, locale === "es" || locale === "en" ? "published" : "missing"])) }));
  }
  const rows = await getDb().select({ page: pages, translation: pageTranslations }).from(pages).leftJoin(pageTranslations, eq(pageTranslations.pageId, pages.id)).orderBy(asc(pages.key), asc(pageTranslations.locale));
  const grouped = new Map<string, { id: string; title: string; sourceRevision: number; paths: Record<string, string>; translationIds: Record<string, string>; locales: Record<string, string> }>();
  for (const { page, translation } of rows) {
    const current = grouped.get(page.id) ?? { id: page.id, title: page.key, sourceRevision: page.sourceRevision, paths: {}, translationIds: {}, locales: Object.fromEntries(locales.map((locale) => [locale, "missing"])) };
    if (translation) { current.paths[translation.locale] = translation.localizedPath.replace(/^\/+|\/+$/g, ""); current.translationIds[translation.locale] = translation.id; current.locales[translation.locale] = translation.status; if (translation.locale === "es") current.title = translation.title; }
    grouped.set(page.id, current);
  }
  return [...grouped.values()];
}
