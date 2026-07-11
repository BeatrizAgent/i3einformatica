import type { MetadataRoute } from "next";
import { pageHref, getRuntimePages } from "@/lib/content/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.i3einformatica.com";
  const pages = await getRuntimePages();
  return pages.map((page) => {
    const languages = Object.fromEntries(Object.entries(page.availableLocales ?? {}).map(([locale, href]) => [locale, new URL(href, baseUrl).toString()]));
    return {
      url: new URL(pageHref(page), baseUrl).toString(),
      lastModified: page.updatedAt,
      changeFrequency: page.id === "home" ? "weekly" as const : "monthly" as const,
      priority: page.id === "home" ? 1 : 0.7,
      alternates: { languages },
    };
  });
}
