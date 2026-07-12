import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pageHref, publishedPages } from "../src/lib/content/repository";
import { publicUrl } from "../src/lib/public-path";

const out = join(process.cwd(), "out");
const errors: string[] = [];
const routeSet = new Set(publishedPages.map((page) => pageHref(page).replace(/\/$/, "") || "/"));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function fileFor(href: string) {
  const clean = href.replace(/^\//, "").replace(/\/$/, "");
  return join(out, clean, "index.html");
}

function parseAttributes(tagContent: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const matches = tagContent.matchAll(/(\w+)="([^"]+)"/g);
  for (const m of matches) {
    attrs[m[1].toLowerCase()] = m[2];
  }
  return attrs;
}

// 1. Audit HTML Pages
for (const page of publishedPages) {
  const file = fileFor(pageHref(page));
  if (!existsSync(file)) {
    errors.push(`${pageHref(page)}: missing export file`);
    continue;
  }
  const html = readFileSync(file, "utf8");

  // H1 Check
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) errors.push(`${pageHref(page)}: expected exactly one h1, got ${h1Count}`);

  // Encoding/Mojibake Check
  if (/[\u00c3\u00c2\ufffd]/u.test(html)) errors.push(`${pageHref(page)}: mojibake in generated HTML`);

  // Title and Description Checks
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    errors.push(`${pageHref(page)}: missing or empty <title>`);
  }

  const metaMatches = html.matchAll(/<meta\s+([^>]+)>/gi);
  let hasDescription = false;
  for (const m of metaMatches) {
    const attrs = parseAttributes(m[1]);
    if (attrs.name === "description" && attrs.content && attrs.content.trim()) {
      hasDescription = true;
    }
  }
  if (!hasDescription) {
    errors.push(`${pageHref(page)}: missing or empty meta description`);
  }

  // Canonical Link Check
  const canonicalPath = pageHref(page).endsWith("/") ? pageHref(page) : `${pageHref(page)}/`;
  const expectedCanonical = publicUrl(canonicalPath);
  if (!html.includes(`rel="canonical" href="${expectedCanonical}"`)) {
    errors.push(`${pageHref(page)}: canonical mismatch (expected ${expectedCanonical})`);
  }

  // Hreflang and Alternate Link Checks
  const linkMatches = html.matchAll(/<link\s+([^>]+)>/gi);
  const hreflangs: Record<string, string> = {};
  for (const m of linkMatches) {
    const attrs = parseAttributes(m[1]);
    if (attrs.rel === "alternate" && attrs.hreflang && attrs.href) {
      hreflangs[attrs.hreflang] = attrs.href;
    }
  }

  if (!hreflangs["es-ES"]) errors.push(`${pageHref(page)}: missing es-ES hreflang alternate link`);
  if (!hreflangs["x-default"]) errors.push(`${pageHref(page)}: missing x-default hreflang alternate link`);
  if (page.locale === "en" && !hreflangs["en-GB"]) {
    errors.push(`${pageHref(page)}: missing en-GB hreflang alternate link`);
  }

  // Internal Links Check
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#") || href.includes("#") || href.includes("favicon.ico") || href.startsWith(`${basePath}/_next`) || href.startsWith(`${basePath}/assets`) || href.startsWith("/assets")) continue;
    const normalized = href.replace(basePath, "").replace(/\/$/, "") || "/";
    if (!routeSet.has(normalized)) errors.push(`${pageHref(page)}: internal link has no generated route: ${href}`);
  }
}

// 2. Audit robots.txt
const robotsFile = join(out, "robots.txt");
if (!existsSync(robotsFile)) {
  errors.push("missing robots.txt");
} else {
  const robots = readFileSync(robotsFile, "utf8");
  const expectedSitemapUrl = publicUrl("/sitemap.xml");
  if (!robots.includes(`Sitemap: ${expectedSitemapUrl}`)) {
    errors.push(`robots.txt mismatch: missing correct Sitemap: ${expectedSitemapUrl}`);
  }
}

// 3. Audit sitemap.xml
const sitemapFile = join(out, "sitemap.xml");
if (!existsSync(sitemapFile)) {
  errors.push("missing sitemap.xml");
} else {
  const sitemap = readFileSync(sitemapFile, "utf8");
  for (const page of publishedPages) {
    const canonicalPath = pageHref(page).endsWith("/") ? pageHref(page) : `${pageHref(page)}/`;
    const expectedUrl = publicUrl(canonicalPath);
    if (!sitemap.includes(`<loc>${expectedUrl}</loc>`)) {
      errors.push(`sitemap.xml missing URL: ${expectedUrl}`);
    }
  }
}

// 4. Report Results
if (!existsSync(join(out, "404.html"))) errors.push("missing out/404.html");
if (errors.length) {
  console.error(`Export validation failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.info(`Export validation passed: audited all ${publishedPages.length} pages, verified titles, descriptions, canonicals, hreflangs, robots.txt, and sitemap.xml successfully.`);
}
