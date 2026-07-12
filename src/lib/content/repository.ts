import { getPageDocument, pageContentById, resolveAction, type ContentLocale } from "@/lib/page-content";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export type PublishedLocale = Extract<Locale, ContentLocale>;

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

const routeDefinitions = [
  ["home", "home"],
  ["m365", "microsoft-365"],
  ["products", "microsoft-365-products"],
  ["solutions", "microsoft-365-solutions"],
  ["cyber", "cybersecurity"],
  ["azure", "microsoft-azure"],
  ["infra", "it-infrastructure"],
  ["compliance", "compliance"],
  ["cases", "success-stories"],
  ["company", "about-us"],
  ["jobs", "join-team"],
  ["contact", "contact"],
  ["privacy", "privacy-policy"],
  ["cookies", "cookie-policy"],
  ["legal", "legal-notice"],
  ["complaints", "complaints"],
] as const;

const forms: Partial<Record<string, PageRecord["form"]>> = {
  jobs: "jobs",
  contact: "contact",
  complaints: "complaint",
};

const contentIds = new Set(Object.keys(pageContentById));

function normalizePath(path: string) {
  return path.replace(/^\/en\/?/, "").replace(/^\/+|\/+$/g, "");
}

function toRecord(id: string, contentId: string, locale: PublishedLocale): PageRecord | null {
  const document = getPageDocument(contentId);
  const content = document?.locales[locale];
  if (!content) return null;

  const action = resolveAction(content.hero.cta, locale) ?? { label: locale === "es" ? "Contactar" : "Contact", href: locale === "es" ? "/contacto" : "/en/contact" };
  const highlights = content.blocks.flatMap((block) => (block.items ?? []).slice(0, 3).map((item) => ({
    title: typeof item.title === "string" ? item.title : typeof item.heading === "string" ? item.heading : "",
    text: typeof item.summary === "string" ? item.summary : typeof item.body === "string" ? item.body : "",
  }))).filter((item) => item.title);

  return {
    id,
    locale,
    path: normalizePath(content.path),
    title: content.hero.title,
    description: content.seo.description,
    eyebrow: content.hero.eyebrow,
    intro: content.hero.intro,
    highlights,
    sections: content.blocks.filter((block) => block.title).map((block) => ({ level: 2 as const, heading: block.title!, text: block.intro ?? "" })),
    cta: { title: content.cta?.title ?? action.label, text: content.cta?.text ?? content.seo.description, href: action.href, label: action.label },
    form: forms[id],
    updatedAt: "2026-07-12",
  };
}

export const publishedPages: PageRecord[] = routeDefinitions.flatMap(([id, contentId]) => {
  if (!contentIds.has(contentId)) throw new Error(`Missing JSON content document: ${contentId}`);
  return (["es", "en"] as const).map((locale) => toRecord(id, contentId, locale)).filter((page): page is PageRecord => Boolean(page));
});

function withAlternates(page: PageRecord): PageRecord {
  const es = publishedPages.find((candidate) => candidate.id === page.id && candidate.locale === "es");
  const en = publishedPages.find((candidate) => candidate.id === page.id && candidate.locale === "en");
  return { ...page, availableLocales: { ...(es ? { es: pageHref(es) } : {}), ...(en ? { en: pageHref(en) } : {}) } };
}

export function parsePublicPath(segments: string[] = []) {
  const first = segments[0] as Locale | undefined;
  const hasLocale = Boolean(first && locales.includes(first) && first !== "es");
  return { locale: (hasLocale ? first : "es") as Locale, path: (hasLocale ? segments.slice(1) : segments).join("/") };
}

export function getPage(locale: Locale, path: string) {
  if (locale !== "es" && locale !== "en") return null;
  const page = publishedPages.find((candidate) => candidate.locale === locale && candidate.path === path);
  return page ? withAlternates(page) : null;
}

export async function getRuntimePage(locale: Locale, path: string) {
  return getPage(locale, path);
}

export async function getRuntimePages() {
  return publishedPages.map(withAlternates);
}

export function getEquivalent(pageId: string, locale: PublishedLocale) {
  return publishedPages.find((page) => page.id === pageId && page.locale === locale) ?? null;
}

export function pageHref(page: PageRecord) {
  const path = page.path ? `/${page.path}` : "";
  return page.locale === "es" ? path || "/" : `/${page.locale}${path}`;
}
