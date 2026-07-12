import type { MetadataRoute } from "next";
import { pageHref, getRuntimePages } from "@/lib/content/repository";
import { publicUrl } from "@/lib/public-path";

export const dynamic = "force-static";

function canonicalHref(href: string) {
  return href.endsWith("/") ? href : `${href}/`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getRuntimePages();
  return pages.map((page) => {
    const languages = Object.fromEntries(Object.entries(page.availableLocales ?? {}).map(([locale, href]) => [locale, publicUrl(canonicalHref(href))]));
    return {
      url: publicUrl(canonicalHref(pageHref(page))),
      lastModified: page.updatedAt,
      changeFrequency: page.id === "home" ? "weekly" as const : "monthly" as const,
      priority: page.id === "home" ? 1 : 0.7,
      alternates: { languages },
    };
  });
}
