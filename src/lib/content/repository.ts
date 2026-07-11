import auditSnapshot from "../../../data/audit/site-audit.json";
import { getPublishedAlternates, getPublishedPage } from "@/lib/i18n/content";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { pages, pageTranslations } from "@/db/schema";

export const locales = ["es", "ca", "eu", "gl", "pt", "en", "fr", "de"] as const;
export type Locale = (typeof locales)[number];
export type PublishedLocale = Locale;

export type ContentSection = { level: 2 | 3; heading: string; text: string };
export type PageRecord = {
  id: string;
  locale: PublishedLocale;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  highlights: { title: string; text: string }[];
  sections: ContentSection[];
  cta: { title: string; text: string; href: string; label: string };
  form?: "contact" | "jobs" | "complaint";
  updatedAt: string;
  availableLocales?: Partial<Record<Locale, string>>;
};

type AuditPage = {
  path: string;
  locale: string;
  title: string;
  description: string;
  visibleText: string;
  headings: { level: number; text: string }[];
};

const auditedPages = auditSnapshot.pages as AuditPage[];
const routePairs = [
  ["home", "/", "/en/"],
  ["m365", "/microsoft-365/", "/en/microsoft-365/"],
  ["products", "/microsoft-365/producto/", "/en/microsoft-365/microsoft-365-products/"],
  ["solutions", "/microsoft-365/soluciones/", "/en/microsoft-365/microsoft-365-solutions/"],
  ["cyber", "/ciberseguridad/", "/en/cybersecurity/"],
  ["azure", "/microsoft-azure/", "/en/microsoft-azure/"],
  ["infra", "/infraestructuras-it/", "/en/it-infrastructure/"],
  ["compliance", "/compliance-y-certificaciones/", "/en/compliance-and-certifications/"],
  ["cases", "/casos-de-exito/", "/en/success-stories/"],
  ["company", "/sobre-nosotros/", "/en/about-us/"],
  ["jobs", "/unete-al-equipo/", "/en/join-the-team/"],
  ["contact", "/contacto/", "/en/contact/"],
  ["privacy", "/politica-de-privacidad/", "/en/privacy-policy/"],
  ["cookies", "/politica-de-cookies/", "/en/cookie-policy/"],
  ["legal", "/aviso-legal/", "/en/legal-notice/"],
  ["complaints", "/denuncias/", "/en/complaints/"],
] as const;

const forms: Partial<Record<string, PageRecord["form"]>> = {
  jobs: "jobs",
  "join-team": "jobs",
  contact: "contact",
  complaints: "complaint",
};

function repairMojibake(value: string) {
  if (!/[ÃÂâ]/.test(value)) return value;
  try {
    const repaired = Buffer.from(value, "latin1").toString("utf8");
    return repaired.includes("�") ? value : repaired;
  } catch {
    return value;
  }
}

function clean(value: string) {
  return repairMojibake(value).replace(/\s+/g, " ").trim();
}

function cleanHeading(value: string) {
  return clean(value).replace(/<[^>]*>/g, "").trim();
}

function extractContent(page: AuditPage) {
  const headings = page.headings.filter((heading) => heading.text).map((heading) => ({ ...heading, text: cleanHeading(heading.text) }));
  const h1Index = headings.findIndex((heading) => heading.level === 1);
  const relevant = headings.slice(Math.max(0, h1Index));
  const h1 = relevant.find((heading) => heading.level === 1)?.text;
  const source = clean(page.visibleText);
  const firstContentHeading = relevant.find((heading) => heading.level === 2 || heading.level === 3)?.text;
  const firstContentPosition = firstContentHeading ? source.indexOf(firstContentHeading) : -1;
  const languageMarker = source.indexOf("Español English");
  const afterLanguageSelector = languageMarker >= 0 ? languageMarker + "Español English".length : 0;
  const headingAfterNavigation = h1 ? source.indexOf(h1, afterLanguageSelector) : -1;
  const start = headingAfterNavigation >= 0 ? headingAfterNavigation : h1 && firstContentPosition > 0 ? source.lastIndexOf(h1, firstContentPosition) : h1 ? source.indexOf(h1) : 0;
  let body = source.slice(start >= 0 ? start + (h1?.length ?? 0) : 0);
  for (const footerMarker of ["I3e IT Resources", "Somos una compañía especialista", "We are a company specialising"]) {
    const footer = body.indexOf(footerMarker);
    if (footer > 0) body = body.slice(0, footer);
  }

  const contentHeadings = relevant.filter((heading) => heading.level === 2 || heading.level === 3);
  const positions = contentHeadings.map((heading) => ({ ...heading, position: body.indexOf(heading.text) }));
  const firstHeading = positions.find((heading) => heading.position >= 0)?.position ?? body.length;
  let introSource = body.slice(0, firstHeading);
  for (const formMarker of [" Contactar ", " Contact ", " Solicitar información ", " Request information ", " Más información ", " More information ", "Tu nombre*", "Your name*", "¿Qué necesitas reportar?", "What do you need to report?"]) {
    const formStart = introSource.indexOf(formMarker);
    if (formStart > 0) introSource = introSource.slice(0, formStart);
  }
  const intro = clean(introSource);
  const sections: ContentSection[] = positions.flatMap((heading, index) => {
    if (heading.position < 0 || (heading.level !== 2 && heading.level !== 3)) return [];
    const next = positions.slice(index + 1).find((candidate) => candidate.position > heading.position)?.position ?? body.length;
    return [{
      level: heading.level,
      heading: heading.text,
      text: clean(body.slice(heading.position + heading.text.length, next)),
    }];
  });
  return { h1, intro, sections };
}

function toRecord(id: string, page: AuditPage, locale: PublishedLocale): PageRecord {
  page = { ...page, title: repairMojibake(page.title), description: repairMojibake(page.description) };
  const { h1, intro, sections } = extractContent(page);
  const path = page.path.replace(/^\/en\/?/, "").replace(/^\/+|\/+$/g, "");
  const highlightSource = sections.filter((section) => section.level === 3).slice(0, 3);
  const record: PageRecord = {
    id,
    locale,
    path,
    title: h1 ?? page.title.replace(/\s+-\s+i3e Informática$/i, ""),
    description: page.description,
    eyebrow: "i3e Informática",
    intro: intro || page.description,
    highlights: highlightSource.map((section) => ({ title: section.heading, text: section.text })),
    sections,
    cta: locale === "es"
      ? { title: "Contactar", text: page.description, href: "/contacto", label: "Contactar" }
      : { title: "Contact", text: page.description, href: "/en/contact", label: "Contact" },
    form: forms[id],
    updatedAt: auditSnapshot.completedAt.slice(0, 10),
  };
  record.eyebrow = repairMojibake(record.eyebrow);
  return record;
}

export const publishedPages: PageRecord[] = routePairs.flatMap(([id, esPath, enPath]) => {
  const es = auditedPages.find((page) => page.path === esPath);
  const en = auditedPages.find((page) => page.path === enPath);
  if (!es || !en) throw new Error(`Audit snapshot is missing the ${id} ES/EN pair`);
  return [toRecord(id, es, "es"), toRecord(id, en, "en")];
});

export function parsePublicPath(segments: string[] = []) {
  const first = segments[0] as Locale | undefined;
  const hasLocale = Boolean(first && locales.includes(first) && first !== "es");
  return {
    locale: (hasLocale ? first : "es") as Locale,
    path: (hasLocale ? segments.slice(1) : segments).join("/"),
  };
}

export function getPage(locale: Locale, path: string) {
  if (locale !== "es" && locale !== "en") return null;
  return publishedPages.find((page) => page.locale === locale && page.path === path) ?? null;
}

export async function getRuntimePage(locale: Locale, path: string) {
  if (!process.env.DATABASE_URL) return getPage(locale, path);
  const result = await getPublishedPage(locale, `/${path}`);
  if (!result) return null;
  const content = result.translation.content as { visibleText?: string; headings?: { level: number; text: string }[] };
  const record = toRecord(result.page.key, {
    path: result.translation.localizedPath,
    locale,
    title: result.translation.seoTitle ?? result.translation.title,
    description: result.translation.seoDescription ?? result.translation.excerpt ?? "",
    visibleText: content.visibleText ?? "",
    headings: content.headings ?? [],
  }, locale);
  record.availableLocales = await getPublishedAlternates(result.page.id);
  return record;
}

export async function getRuntimePages() {
  if (!process.env.DATABASE_URL) return publishedPages.map((page) => ({ ...page, availableLocales: { es: pageHref(getEquivalent(page.id, "es")!), en: pageHref(getEquivalent(page.id, "en")!) } }));
  const rows = await getDb().select({ page: pages, translation: pageTranslations }).from(pageTranslations).innerJoin(pages, eq(pages.id, pageTranslations.pageId)).where(and(eq(pageTranslations.status, "published"), eq(pages.active, true)));
  return Promise.all(rows.map(async ({ page, translation }) => {
    const content = translation.content as { visibleText?: string; headings?: { level: number; text: string }[] };
    const record = toRecord(page.key, { path: translation.localizedPath, locale: translation.locale, title: translation.seoTitle ?? translation.title, description: translation.seoDescription ?? translation.excerpt ?? "", visibleText: content.visibleText ?? "", headings: content.headings ?? [] }, translation.locale);
    record.availableLocales = await getPublishedAlternates(page.id);
    return record;
  }));
}

export function getEquivalent(pageId: string, locale: PublishedLocale) {
  return publishedPages.find((page) => page.id === pageId && page.locale === locale) ?? null;
}

export function pageHref(page: PageRecord) {
  const path = page.path ? `/${page.path}` : "";
  return page.locale === "es" ? path || "/" : `/${page.locale}${path}`;
}
