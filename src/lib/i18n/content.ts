import { and, asc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import {
  pages,
  pageSections,
  pageSectionTranslations,
  pageTranslations,
  type Locale,
} from "@/db/schema";

import { buildLocalizedPath, normalizePath } from "./routing";

export async function getPublishedPage(locale: Locale, localizedPath: string) {
  const db = getDb();
  const [translation] = await db
    .select({ page: pages, translation: pageTranslations })
    .from(pageTranslations)
    .innerJoin(pages, eq(pageTranslations.pageId, pages.id))
    .where(
      and(
        eq(pageTranslations.locale, locale),
        eq(pageTranslations.localizedPath, normalizePath(localizedPath)),
        eq(pageTranslations.status, "published"),
        eq(pages.active, true),
      ),
    )
    .limit(1);

  if (!translation) return null;

  const sections = await db
    .select({ section: pageSections, translation: pageSectionTranslations })
    .from(pageSections)
    .innerJoin(
      pageSectionTranslations,
      and(
        eq(pageSectionTranslations.pageSectionId, pageSections.id),
        eq(pageSectionTranslations.locale, locale),
        eq(pageSectionTranslations.status, "published"),
      ),
    )
    .where(and(eq(pageSections.pageId, translation.page.id), eq(pageSections.active, true)))
    .orderBy(asc(pageSections.position));

  return { ...translation, sections };
}

export async function getPublishedAlternates(pageId: string) {
  const db = getDb();
  const rows = await db
    .select({ locale: pageTranslations.locale, localizedPath: pageTranslations.localizedPath })
    .from(pageTranslations)
    .where(and(eq(pageTranslations.pageId, pageId), eq(pageTranslations.status, "published")));

  return Object.fromEntries(rows.map((row) => [row.locale, buildLocalizedPath(row.locale, row.localizedPath)])) as Partial<
    Record<Locale, string>
  >;
}

export async function getSpanishFallback(pageId: string): Promise<string | null> {
  const db = getDb();
  const [spanish] = await db
    .select({ path: pageTranslations.localizedPath })
    .from(pageTranslations)
    .where(
      and(
        eq(pageTranslations.pageId, pageId),
        eq(pageTranslations.locale, "es"),
        eq(pageTranslations.status, "published"),
      ),
    )
    .limit(1);
  return spanish?.path ?? null;
}
