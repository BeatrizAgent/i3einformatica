import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const BASE_URL = process.env.AUDIT_BASE_URL ?? "https://www.i3einformatica.com";
const OUTPUT_DIR = resolve(process.env.AUDIT_OUTPUT_DIR ?? "data/audit");
const SITEMAP_URL = new URL("/page-sitemap.xml", BASE_URL).href;

type Alternate = { hreflang: string; href: string };
type FormField = { tag: string; type?: string; name?: string; required: boolean };
type PageAudit = {
  url: string;
  path: string;
  locale: "es" | "en";
  status: number;
  finalUrl: string;
  contentType: string | null;
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  og: Record<string, string>;
  alternates: Alternate[];
  headings: Array<{ level: number; text: string }>;
  links: string[];
  images: Array<{ src: string; alt: string | null }>;
  documents: string[];
  forms: Array<{ action: string | null; method: string; fields: FormField[] }>;
  visibleText: string;
  responseHeaders: Record<string, string | null>;
  htmlSha256: string;
  fetchedAt: string;
};

const entityMap: Record<string, string> = {
  amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ",
};

function decodeHtml(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(Number.parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (whole, name) => entityMap[name.toLowerCase()] ?? whole);
}

function plainText(value: string): string {
  return decodeHtml(value.replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ").trim();
}

function attr(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? decodeHtml(match[1] ?? match[2] ?? match[3]) : null;
}

function absolute(value: string, base: string): string {
  try { return new URL(value, base).href; } catch { return value; }
}

function meta(html: string, key: string): string | null {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (attr(tag, "name") === key || attr(tag, "property") === key) return attr(tag, "content");
  }
  return null;
}

function linksByRel(html: string, rel: string): string[] {
  return (html.match(/<link\b[^>]*>/gi) ?? [])
    .filter((tag) => (attr(tag, "rel") ?? "").split(/\s+/).includes(rel))
    .map((tag) => attr(tag, "href"))
    .filter((value): value is string => Boolean(value));
}

function parseSitemap(xml: string) {
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  return blocks.map((block) => ({
    url: decodeHtml(block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1] ?? ""),
    lastmod: block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1] ?? null,
    alternates: [...block.matchAll(/<xhtml:link\b[^>]*>/g)].map(([tag]) => ({
      hreflang: attr(tag, "hreflang") ?? "",
      href: attr(tag, "href") ?? "",
    })),
    images: [...block.matchAll(/<image:loc>([\s\S]*?)<\/image:loc>/g)].map((match) => decodeHtml(match[1])),
  }));
}

function parsePage(html: string, url: string): Omit<PageAudit, "status" | "finalUrl" | "contentType" | "responseHeaders" | "fetchedAt"> {
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const alternates = (html.match(/<link\b[^>]*>/gi) ?? [])
    .filter((tag) => (attr(tag, "rel") ?? "").split(/\s+/).includes("alternate") && attr(tag, "hreflang"))
    .map((tag) => ({ hreflang: attr(tag, "hreflang")!, href: absolute(attr(tag, "href")!, url) }));
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({ level: Number(match[1]), text: plainText(match[2]) })).filter((h) => h.text);
  const links = [...new Set((html.match(/<a\b[^>]*>/gi) ?? []).map((tag) => attr(tag, "href"))
    .filter((value): value is string => Boolean(value)).map((value) => absolute(value, url)))].sort();
  const images = (html.match(/<img\b[^>]*>/gi) ?? []).map((tag) => ({
    src: absolute(attr(tag, "src") ?? attr(tag, "data-src") ?? "", url), alt: attr(tag, "alt"),
  })).filter((image) => image.src);
  const documents = links.filter((link) => /\.(?:pdf|docx?|xlsx?|pptx?|zip)(?:[?#]|$)/i.test(link));
  const forms = [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)].map((match) => {
    const open = `<form ${match[1]}>`;
    const fields = (match[2].match(/<(?:input|select|textarea)\b[^>]*>/gi) ?? []).map((tag) => ({
      tag: tag.match(/^<(\w+)/i)?.[1].toLowerCase() ?? "unknown",
      type: attr(tag, "type") ?? undefined,
      name: attr(tag, "name") ?? undefined,
      required: /\srequired(?:\s|=|>)/i.test(tag),
    }));
    return { action: attr(open, "action"), method: (attr(open, "method") ?? "get").toLowerCase(), fields };
  });
  const og: Record<string, string> = {};
  for (const property of ["og:title", "og:description", "og:url", "og:image", "og:locale"]) {
    const value = meta(html, property); if (value) og[property] = value;
  }
  const parsedUrl = new URL(url);
  return {
    url, path: parsedUrl.pathname, locale: parsedUrl.pathname.startsWith("/en/") || parsedUrl.pathname === "/en/" ? "en" : "es",
    title: title ? plainText(title[1]) : null,
    description: meta(html, "description"), canonical: linksByRel(html, "canonical")[0] ?? null,
    robots: meta(html, "robots"), og, alternates, headings, links, images, documents, forms,
    visibleText: plainText(html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html),
    htmlSha256: createHash("sha256").update(html).digest("hex"),
  };
}

function imageDimensions(bytes: Uint8Array, mime: string | null): { width: number; height: number } | null {
  if (mime?.includes("png") && bytes.length >= 24) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }
  if (mime?.includes("jpeg")) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset++; continue; }
      const marker = bytes[offset + 1];
      const length = view.getUint16(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      }
      if (length < 2) break;
      offset += length + 2;
    }
  }
  if (mime?.includes("svg")) {
    const text = new TextDecoder().decode(bytes.slice(0, 4096));
    const width = text.match(/\bwidth=["']([\d.]+)/i)?.[1];
    const height = text.match(/\bheight=["']([\d.]+)/i)?.[1];
    if (width && height) return { width: Number(width), height: Number(height) };
    const viewBox = text.match(/\bviewBox=["'][^"']*?([\d.]+)[ ,]+([\d.]+)["']/i);
    if (viewBox) return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
  }
  return null;
}

async function fetchText(url: string) {
  const response = await fetch(url, { headers: { "user-agent": "i3e-migration-audit/1.0 (+internal migration inventory)" }, redirect: "follow" });
  return { response, text: await response.text() };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const startedAt = new Date().toISOString();
  const { response: sitemapResponse, text: sitemapXml } = await fetchText(SITEMAP_URL);
  if (!sitemapResponse.ok) throw new Error(`Sitemap request failed: ${sitemapResponse.status}`);
  const sitemap = parseSitemap(sitemapXml);
  const pages: PageAudit[] = [];
  for (const entry of sitemap) {
    const { response, text: html } = await fetchText(entry.url);
    const parsed = parsePage(html, entry.url);
    pages.push({ ...parsed, status: response.status, finalUrl: response.url,
      contentType: response.headers.get("content-type"), fetchedAt: new Date().toISOString(),
      responseHeaders: Object.fromEntries(["content-security-policy", "strict-transport-security", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"].map((name) => [name, response.headers.get(name)])),
    });
    process.stdout.write(`${response.status} ${entry.url}\n`);
  }
  const sitemapImages = [...new Set(sitemap.flatMap((entry) => entry.images))].sort();
  const discoveredImages = [...new Set(pages.flatMap((page) => page.images.map((image) => image.src)))].sort();
  const assets = [];
  for (const url of sitemapImages) {
    const response = await fetch(url, { headers: { "user-agent": "i3e-migration-audit/1.0 (+internal migration inventory)" } });
    const bytes = new Uint8Array(await response.arrayBuffer());
    const mime = response.headers.get("content-type");
    assets.push({ url, status: response.status, mime, bytes: bytes.byteLength,
      dimensions: imageDimensions(bytes, mime), sha256: createHash("sha256").update(bytes).digest("hex"),
      usedBy: sitemap.filter((entry) => entry.images.includes(url)).map((entry) => new URL(entry.url).pathname) });
  }
  const report = {
    schemaVersion: 1, startedAt, completedAt: new Date().toISOString(), baseUrl: BASE_URL, sitemapUrl: SITEMAP_URL,
    counts: { sitemapPages: sitemap.length, esPages: pages.filter((p) => p.locale === "es").length,
      enPages: pages.filter((p) => p.locale === "en").length, sitemapImages: sitemapImages.length,
      htmlImages: discoveredImages.length, forms: pages.reduce((sum, page) => sum + page.forms.length, 0),
      documents: new Set(pages.flatMap((page) => page.documents)).size },
    sitemap, sitemapImages, discoveredImages, assets, pages,
  };
  await writeFile(resolve(OUTPUT_DIR, "site-audit.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(resolve(OUTPUT_DIR, "page-sitemap.xml"), sitemapXml, "utf8");
  process.stdout.write(`Audit written to ${resolve(OUTPUT_DIR, "site-audit.json")}\n`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
