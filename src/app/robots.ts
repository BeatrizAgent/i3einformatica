import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.i3einformatica.com";
  const locales = ["es", "ca", "eu", "gl", "pt", "en", "fr", "de"];

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/preview/"] },
    sitemap: [new URL("/sitemap.xml", baseUrl).toString(), ...locales.map((locale) => new URL(`/sitemaps/${locale}.xml`, baseUrl).toString())],
    host: baseUrl,
  };
}
