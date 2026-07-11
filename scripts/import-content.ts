import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { loadEnvConfig } from "@next/env";
import { and, eq, sql } from "drizzle-orm";

import { closeDb, getDb } from "../src/db";
import {
  mediaAssets,
  mediaAssetTranslations,
  pages,
  pageSections,
  pageSectionTranslations,
  pageTranslations,
  translationJobs,
  type Locale,
  locales,
} from "../src/db/schema";

loadEnvConfig(process.cwd());

type AuditTranslation = {
  locale: Locale;
  path?: string;
  localizedPath?: string;
  url?: string;
  title: string;
  excerpt?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  content?: Record<string, unknown>;
  sections?: AuditSection[];
};

type AuditSection = {
  key: string;
  type?: string;
  componentType?: string;
  position: number;
  config?: Record<string, unknown>;
  schema?: Record<string, unknown>;
  content?: Record<string, unknown>;
};

type AuditPage = {
  key: string;
  type?: "landing" | "legal" | "listing" | "form";
  active?: boolean;
  config?: Record<string, unknown>;
  translations: AuditTranslation[];
};

type AuditAsset = {
  sourceUrl: string;
  mimeType?: string;
  width?: number;
  height?: number;
  translations?: Array<{ locale: Locale; alt: string; title?: string; caption?: string }>;
};

type AuditSnapshot = { pages: AuditPage[]; assets?: AuditAsset[] };

type RawAuditPage = {
  url: string;
  path: string;
  locale: string;
  title: string;
  description?: string;
  og?: Record<string, string>;
  headings?: Array<{ level: number; text: string }>;
  links?: string[];
  images?: Array<{ src: string; alt?: string }>;
  forms?: unknown[];
  visibleText?: string;
  status?: number;
};

type RawAudit = {
  pages: RawAuditPage[];
  assets?: Array<{
    url: string;
    mime?: string;
    dimensions?: { width?: number; height?: number } | null;
  }>;
};

const stablePageKeys: Record<string, string> = {
  "/": "home",
  "/en/": "home",
  "/microsoft-365/": "microsoft-365",
  "/en/microsoft-365/": "microsoft-365",
  "/microsoft-365/producto/": "microsoft-365-products",
  "/en/microsoft-365/microsoft-365-products/": "microsoft-365-products",
  "/microsoft-365/soluciones/": "microsoft-365-solutions",
  "/en/microsoft-365/microsoft-365-solutions/": "microsoft-365-solutions",
  "/ciberseguridad/": "cybersecurity",
  "/en/cybersecurity/": "cybersecurity",
  "/microsoft-azure/": "microsoft-azure",
  "/en/microsoft-azure/": "microsoft-azure",
  "/infraestructuras-it/": "it-infrastructure",
  "/en/it-infrastructure/": "it-infrastructure",
  "/compliance-y-certificaciones/": "compliance",
  "/en/compliance-and-certifications/": "compliance",
  "/casos-de-exito/": "success-stories",
  "/en/success-stories/": "success-stories",
  "/sobre-nosotros/": "about-us",
  "/en/about-us/": "about-us",
  "/unete-al-equipo/": "join-team",
  "/en/join-the-team/": "join-team",
  "/contacto/": "contact",
  "/en/contact/": "contact",
  "/politica-de-privacidad/": "privacy-policy",
  "/en/privacy-policy/": "privacy-policy",
  "/politica-de-cookies/": "cookie-policy",
  "/en/cookie-policy/": "cookie-policy",
  "/aviso-legal/": "legal-notice",
  "/en/legal-notice/": "legal-notice",
  "/denuncias/": "complaints",
  "/en/complaints/": "complaints",
};

function pageType(key: string): AuditPage["type"] {
  if (["privacy-policy", "cookie-policy", "legal-notice"].includes(key)) return "legal";
  if (["contact", "join-team", "complaints"].includes(key)) return "form";
  if (key === "success-stories") return "listing";
  return "landing";
}

function coerceSnapshot(value: unknown): AuditSnapshot {
  assertSnapshot(value);
  const candidate = value as AuditSnapshot & RawAudit;
  if (candidate.pages.length === 0 || "translations" in candidate.pages[0]!) return candidate;

  const grouped = new Map<string, AuditPage>();
  for (const raw of candidate.pages as unknown as RawAuditPage[]) {
    const key = stablePageKeys[raw.path];
    if (!key) continue; // Deliberately excludes /sobre-nosotros-pruebas/ and unknown staging pages.
    if (!validLocale(raw.locale)) throw new Error(`Unsupported audit locale: ${raw.locale}`);
    const page = grouped.get(key) ?? { key, type: pageType(key), translations: [] };
    page.translations.push({
      locale: raw.locale,
      path: raw.path,
      title: raw.title,
      excerpt: raw.description,
      seoTitle: raw.title,
      seoDescription: raw.description,
      ogTitle: raw.og?.["og:title"],
      ogDescription: raw.og?.["og:description"],
      content: {
        visibleText: raw.visibleText ?? "",
        headings: raw.headings ?? [],
        links: raw.links ?? [],
        images: raw.images ?? [],
        forms: raw.forms ?? [],
        sourceUrl: raw.url,
        sourceStatus: raw.status,
      },
      sections: [
        {
          key: "migrated-content",
          componentType: "legacy_snapshot",
          position: 0,
          content: { visibleText: raw.visibleText ?? "", headings: raw.headings ?? [] },
        },
      ],
    });
    grouped.set(key, page);
  }

  const altByUrl = new Map<string, Map<Locale, string>>();
  for (const raw of candidate.pages as unknown as RawAuditPage[]) {
    if (!validLocale(raw.locale) || !stablePageKeys[raw.path]) continue;
    for (const image of raw.images ?? []) {
      if (!image.alt) continue;
      const translations = altByUrl.get(image.src) ?? new Map<Locale, string>();
      if (!translations.has(raw.locale)) translations.set(raw.locale, image.alt);
      altByUrl.set(image.src, translations);
    }
  }

  const rawAssets = (value as unknown as RawAudit).assets ?? [];
  return {
    pages: [...grouped.values()],
    assets: rawAssets.map((asset) => ({
      sourceUrl: asset.url,
      mimeType: asset.mime,
      width: asset.dimensions?.width,
      height: asset.dimensions?.height,
      translations: [...(altByUrl.get(asset.url) ?? new Map()).entries()].map(([locale, alt]) => ({ locale, alt })),
    })),
  };
}

function assertSnapshot(value: unknown): asserts value is AuditSnapshot {
  if (!value || typeof value !== "object" || !Array.isArray((value as AuditSnapshot).pages)) {
    throw new Error("Audit snapshot must contain a pages array");
  }
}

function normalizedPath(translation: AuditTranslation): string {
  const candidate = translation.localizedPath ?? translation.path ?? translation.url;
  if (!candidate) throw new Error(`Missing localized path for ${translation.locale}:${translation.title}`);
  const pathname = candidate.startsWith("http") ? new URL(candidate).pathname : candidate;
  const withoutLocale = translation.locale !== "es" ? pathname.replace(new RegExp(`^/${translation.locale}(?=/|$)`), "") : pathname;
  const normalized = `/${withoutLocale}`.replace(/\/{2,}/g, "/").replace(/\/$/, "");
  return normalized || "/";
}

function validLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

async function importPage(page: AuditPage): Promise<void> {
  const db = getDb();
  await db.transaction(async (tx) => {
    let [storedPage] = await tx
      .insert(pages)
      .values({ key: page.key, type: page.type ?? "landing", active: page.active ?? true, config: page.config ?? {} })
      .onConflictDoUpdate({
        target: pages.key,
        set: { type: page.type ?? "landing", active: page.active ?? true, config: page.config ?? {}, updatedAt: new Date() },
      })
      .returning();
    if (!storedPage) throw new Error(`Could not import page ${page.key}`);

    const spanish = page.translations.find((translation) => translation.locale === "es");
    let existingSpanish: typeof pageTranslations.$inferSelect | undefined;
    if (spanish) {
      [existingSpanish] = await tx.select().from(pageTranslations).where(and(eq(pageTranslations.pageId, storedPage.id), eq(pageTranslations.locale, "es"))).limit(1);
      const existingSections = existingSpanish ? await tx.select({ key: pageSections.key, content: pageSectionTranslations.content }).from(pageSections).innerJoin(pageSectionTranslations, and(eq(pageSectionTranslations.pageSectionId, pageSections.id), eq(pageSectionTranslations.locale, "es"))).where(eq(pageSections.pageId, storedPage.id)) : [];
      const incomingSnapshot = JSON.stringify({ title: spanish.title, excerpt: spanish.excerpt ?? null, seoTitle: spanish.seoTitle ?? null, seoDescription: spanish.seoDescription ?? null, ogTitle: spanish.ogTitle ?? null, ogDescription: spanish.ogDescription ?? null, content: spanish.content ?? {}, sections: (spanish.sections ?? []).map((section) => ({ key: section.key, content: section.content ?? {} })).sort((a, b) => a.key.localeCompare(b.key)) });
      const existingSnapshot = existingSpanish ? JSON.stringify({ title: existingSpanish.title, excerpt: existingSpanish.excerpt, seoTitle: existingSpanish.seoTitle, seoDescription: existingSpanish.seoDescription, ogTitle: existingSpanish.ogTitle, ogDescription: existingSpanish.ogDescription, content: existingSpanish.content, sections: existingSections.sort((a, b) => a.key.localeCompare(b.key)) }) : incomingSnapshot;
      if (existingSpanish?.translatorType === "migration" && incomingSnapshot !== existingSnapshot) {
        [storedPage] = await tx.update(pages).set({ sourceRevision: sql`${pages.sourceRevision} + 1`, updatedAt: new Date() }).where(eq(pages.id, storedPage.id)).returning();
      }
    }

    for (const translation of page.translations) {
      if (!validLocale(translation.locale)) throw new Error(`Unsupported locale: ${translation.locale}`);
      const [existingTranslation] = await tx.select({ translatorType: pageTranslations.translatorType }).from(pageTranslations).where(and(eq(pageTranslations.pageId, storedPage.id), eq(pageTranslations.locale, translation.locale))).limit(1);
      if (existingTranslation && existingTranslation.translatorType !== "migration") continue;
      await tx
        .insert(pageTranslations)
        .values({
          pageId: storedPage.id,
          locale: translation.locale,
          localizedPath: normalizedPath(translation),
          title: translation.title,
          excerpt: translation.excerpt,
          seoTitle: translation.seoTitle,
          seoDescription: translation.seoDescription,
          ogTitle: translation.ogTitle,
          ogDescription: translation.ogDescription,
          content: translation.content ?? {},
          status: "published",
          translatorType: "migration",
          sourceRevision: storedPage.sourceRevision,
          publishedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [pageTranslations.pageId, pageTranslations.locale],
          set: {
            localizedPath: normalizedPath(translation),
            title: translation.title,
            excerpt: translation.excerpt,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            ogTitle: translation.ogTitle,
            ogDescription: translation.ogDescription,
            content: translation.content ?? {},
            status: "published",
            translatorType: "migration",
            sourceRevision: storedPage.sourceRevision,
            publishedAt: new Date(),
            updatedAt: new Date(),
          },
        });

      for (const section of translation.sections ?? []) {
        const [storedSection] = await tx
          .insert(pageSections)
          .values({
            pageId: storedPage.id,
            key: section.key,
            componentType: section.componentType ?? section.type ?? "rich_text",
            position: section.position,
            config: section.config ?? {},
            schema: section.schema ?? {},
          })
          .onConflictDoUpdate({
            target: [pageSections.pageId, pageSections.key],
            set: {
              componentType: section.componentType ?? section.type ?? "rich_text",
              position: section.position,
              config: section.config ?? {},
              schema: section.schema ?? {},
              updatedAt: new Date(),
            },
          })
          .returning();
        if (!storedSection) throw new Error(`Could not import section ${page.key}:${section.key}`);

        const [existingSectionTranslation] = await tx.select({ translatorType: pageSectionTranslations.translatorType }).from(pageSectionTranslations).where(and(eq(pageSectionTranslations.pageSectionId, storedSection.id), eq(pageSectionTranslations.locale, translation.locale))).limit(1);
        if (existingSectionTranslation && existingSectionTranslation.translatorType !== "migration") continue;

        await tx
          .insert(pageSectionTranslations)
          .values({
            pageSectionId: storedSection.id,
            locale: translation.locale,
            content: section.content ?? {},
            status: "published",
            translatorType: "migration",
            sourceRevision: storedPage.sourceRevision,
          })
          .onConflictDoUpdate({
            target: [pageSectionTranslations.pageSectionId, pageSectionTranslations.locale],
            set: {
              content: section.content ?? {},
              status: "published",
              translatorType: "migration",
              sourceRevision: storedPage.sourceRevision,
              updatedAt: new Date(),
            },
          });
      }
    }

    if (!spanish) return;
    const spanishForJobs = existingSpanish && existingSpanish.translatorType !== "migration" ? { ...spanish, title: existingSpanish.title, excerpt: existingSpanish.excerpt ?? undefined, seoTitle: existingSpanish.seoTitle ?? undefined, seoDescription: existingSpanish.seoDescription ?? undefined, ogTitle: existingSpanish.ogTitle ?? undefined, ogDescription: existingSpanish.ogDescription ?? undefined, content: existingSpanish.content } : spanish;
    const createSectionJobs = !existingSpanish || existingSpanish.translatorType === "migration";
    const targetLocales = locales.filter((locale) => locale !== "es" && locale !== "en");
    for (const targetLocale of targetLocales) {
      let [target] = await tx
        .select()
        .from(pageTranslations)
        .where(and(eq(pageTranslations.pageId, storedPage.id), eq(pageTranslations.locale, targetLocale)))
        .limit(1);
      if (!target) {
        [target] = await tx
          .insert(pageTranslations)
          .values({
            pageId: storedPage.id,
            locale: targetLocale,
            localizedPath: normalizedPath(spanishForJobs),
            title: spanishForJobs.title,
            content: {},
            status: "missing",
            translatorType: "machine",
            sourceRevision: storedPage.sourceRevision,
          })
          .returning();
      }
      if (!target) throw new Error(`Could not create ${targetLocale} target for ${page.key}`);
      const [existingJob] = await tx
        .select({ id: translationJobs.id })
        .from(translationJobs)
        .where(
          and(
            eq(translationJobs.targetType, "page_translation"),
            eq(translationJobs.targetId, target.id),
            eq(translationJobs.targetLocale, targetLocale),
            eq(translationJobs.sourceRevision, storedPage.sourceRevision),
          ),
        )
        .limit(1);
      if (!existingJob) {
        await tx.insert(translationJobs).values({
          provider: "openai",
          targetType: "page_translation",
          targetId: target.id,
          sourceLocale: "es",
          targetLocale,
          sourceRevision: storedPage.sourceRevision,
          input: {
            title: spanishForJobs.title,
            excerpt: spanishForJobs.excerpt ?? null,
            seoTitle: spanishForJobs.seoTitle ?? null,
            seoDescription: spanishForJobs.seoDescription ?? null,
            ogTitle: spanishForJobs.ogTitle ?? null,
            ogDescription: spanishForJobs.ogDescription ?? null,
            content: spanishForJobs.content ?? {},
          },
        }).onConflictDoNothing();
      }

      for (const section of createSectionJobs ? spanish.sections ?? [] : []) {
        const [storedSection] = await tx
          .select({ id: pageSections.id })
          .from(pageSections)
          .where(and(eq(pageSections.pageId, storedPage.id), eq(pageSections.key, section.key)))
          .limit(1);
        if (!storedSection) continue;
        let [targetSection] = await tx
          .select()
          .from(pageSectionTranslations)
          .where(
            and(
              eq(pageSectionTranslations.pageSectionId, storedSection.id),
              eq(pageSectionTranslations.locale, targetLocale),
            ),
          )
          .limit(1);
        if (!targetSection) {
          [targetSection] = await tx
            .insert(pageSectionTranslations)
            .values({
              pageSectionId: storedSection.id,
              locale: targetLocale,
              content: {},
              status: "missing",
              translatorType: "machine",
              sourceRevision: storedPage.sourceRevision,
            })
            .returning();
        }
        if (!targetSection) continue;
        const [sectionJob] = await tx
          .select({ id: translationJobs.id })
          .from(translationJobs)
          .where(
            and(
              eq(translationJobs.targetType, "page_section_translation"),
              eq(translationJobs.targetId, targetSection.id),
              eq(translationJobs.targetLocale, targetLocale),
              eq(translationJobs.sourceRevision, storedPage.sourceRevision),
            ),
          )
          .limit(1);
        if (!sectionJob) {
          await tx.insert(translationJobs).values({
            provider: "openai",
            targetType: "page_section_translation",
            targetId: targetSection.id,
            sourceLocale: "es",
            targetLocale,
            sourceRevision: storedPage.sourceRevision,
            input: section.content ?? {},
          }).onConflictDoNothing();
        }
      }
    }
  });
}

let s3: S3Client | undefined;
function getS3(): S3Client {
  s3 ??= new S3Client({
    region: process.env.S3_REGION ?? "us-east-1",
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY } : undefined,
  });
  return s3;
}

async function importAsset(asset: AuditAsset): Promise<void> {
  const response = await fetch(asset.sourceUrl);
  if (!response.ok) throw new Error(`Asset download failed (${response.status}): ${asset.sourceUrl}`);
  const body = new Uint8Array(await response.arrayBuffer());
  const checksum = createHash("sha256").update(body).digest("hex");
  const contentType = asset.mimeType ?? response.headers.get("content-type")?.split(";", 1)[0] ?? "application/octet-stream";
  const extension = extname(new URL(asset.sourceUrl).pathname) || ".bin";
  const storageKey = `migration/${checksum}${extension.toLowerCase()}`;
  const bucket = process.env.S3_BUCKET;
  if (bucket) {
    await getS3().send(new PutObjectCommand({ Bucket: bucket, Key: storageKey, Body: body, ContentType: contentType }));
  }

  const db = getDb();
  const [storedAsset] = await db
    .insert(mediaAssets)
    .values({
      storageKey,
      sourceUrl: asset.sourceUrl,
      checksum,
      mimeType: contentType,
      byteSize: body.byteLength,
      width: asset.width,
      height: asset.height,
    })
    .onConflictDoUpdate({
      target: mediaAssets.checksum,
      set: { sourceUrl: asset.sourceUrl, mimeType: contentType, width: asset.width, height: asset.height, updatedAt: new Date() },
    })
    .returning();
  if (!storedAsset) throw new Error(`Could not import asset ${asset.sourceUrl}`);

  for (const translation of asset.translations ?? []) {
    await db
      .insert(mediaAssetTranslations)
      .values({ mediaAssetId: storedAsset.id, ...translation, translatorType: "migration" })
      .onConflictDoUpdate({
        target: [mediaAssetTranslations.mediaAssetId, mediaAssetTranslations.locale],
        set: { alt: translation.alt, title: translation.title, caption: translation.caption, translatorType: "migration", updatedAt: new Date() },
      });
  }
}

async function run(): Promise<void> {
  const validateOnly = process.argv.includes("--validate-only");
  const inputPath = process.argv.slice(2).find((argument) => !argument.startsWith("--")) ?? "data/audit/site-audit.json";
  const source: unknown = JSON.parse(await readFile(inputPath, "utf8"));
  const parsed = coerceSnapshot(source);

  if (validateOnly) {
    console.info(`Validated ${parsed.pages.length} pages and ${parsed.assets?.length ?? 0} assets; no database writes`);
    return;
  }

  for (const page of parsed.pages) await importPage(page);
  for (const asset of parsed.assets ?? []) await importAsset(asset);
  console.info(`Imported ${parsed.pages.length} pages and ${parsed.assets?.length ?? 0} assets`);
}

run()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(closeDb);
