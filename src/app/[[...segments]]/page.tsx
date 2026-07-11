import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PublicPage } from "@/components/public-page";
import { getEquivalent, getPage, getRuntimePage, pageHref, parsePublicPath, publishedPages } from "@/lib/content/repository";
import { getPageContent } from "@/lib/page-content";

type Props = { params: Promise<{ segments?: string[] }> };

export function generateStaticParams() {
  return publishedPages.map((page) => ({ segments: pageHref(page).split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, path } = parsePublicPath((await params).segments);
  const page = await getRuntimePage(locale, path);
  if (!page) return { title: "Página no encontrada", robots: { index: false, follow: false } };
  const esHref = page.availableLocales?.es ?? (getEquivalent(page.id, "es") ? pageHref(getEquivalent(page.id, "es")!) : "/");
  const enHref = page.availableLocales?.en ?? (getEquivalent(page.id, "en") ? pageHref(getEquivalent(page.id, "en")!) : undefined);
  const canonical = pageHref(page);
  const curated = getPageContent(page.id, page.locale === "en" ? "en" : "es");
  const title = curated?.seo.title ?? page.title;
  const description = curated?.seo.description ?? page.description;
  return {
    title,
    description,
    alternates: { canonical, languages: { ...Object.fromEntries(Object.entries(page.availableLocales ?? {}).map(([key, value]) => [key, value])), "es-ES": esHref, ...(enHref ? { "en-GB": enHref } : {}), "x-default": esHref } },
    openGraph: { type: "website", locale: page.locale === "es" ? "es_ES" : "en_GB", title, description, url: canonical, siteName: "i3e Informática" },
  };
}

export default async function CatchAllPage({ params }: Props) {
  const { locale, path } = parsePublicPath((await params).segments);
  const page = await getRuntimePage(locale, path);
  if (page) return <PublicPage page={page} />;
  if (locale !== "es" && locale !== "en") {
    const fallback = getPage("es", path) ?? publishedPages.find((candidate) => candidate.locale === "en" && candidate.path === path);
    if (fallback) redirect(pageHref(getEquivalent(fallback.id, "es")!));
  }
  notFound();
}
