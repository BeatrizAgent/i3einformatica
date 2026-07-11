import { getRuntimePages, locales, pageHref } from "@/lib/content/repository";

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!);

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: filename } = await params;
  const locale = filename.replace(/\.xml$/, "");
  if (!locales.includes(locale as (typeof locales)[number])) return new Response("Not found", { status: 404 });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.i3einformatica.com";
  const pages = await getRuntimePages();
  const entries = pages.filter((page) => page.locale === locale).map((page) => {
    const alternates = Object.entries(page.availableLocales ?? {}).map(([code, href]) => `<xhtml:link rel="alternate" hreflang="${code}" href="${escapeXml(new URL(href, baseUrl).toString())}"/>`).join("");
    const xDefault = page.availableLocales?.es ? `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(new URL(page.availableLocales.es, baseUrl).toString())}"/>` : "";
    return `<url><loc>${escapeXml(new URL(pageHref(page), baseUrl).toString())}</loc><lastmod>${page.updatedAt}</lastmod>${alternates}${xDefault}</url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } });
}
