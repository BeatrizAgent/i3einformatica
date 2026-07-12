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

for (const page of publishedPages) {
  const file = fileFor(pageHref(page));
  if (!existsSync(file)) {
    errors.push(`${pageHref(page)}: missing export file`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) errors.push(`${pageHref(page)}: expected one h1, got ${h1Count}`);
  const canonicalPath = pageHref(page).endsWith("/") ? pageHref(page) : `${pageHref(page)}/`;
  if (!html.includes(`rel="canonical" href="${publicUrl(canonicalPath)}"`)) errors.push(`${pageHref(page)}: canonical mismatch`);
  if (/[\u00c3\u00c2\ufffd]/u.test(html)) errors.push(`${pageHref(page)}: mojibake in generated HTML`);
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#") || href.includes("#") || href.startsWith(`${basePath}/_next`) || href.startsWith(`${basePath}/assets`)) continue;
    const normalized = href.replace(basePath, "").replace(/\/$/, "") || "/";
    if (!routeSet.has(normalized)) errors.push(`${pageHref(page)}: internal link has no generated route: ${href}`);
  }
}

if (!existsSync(join(out, "404.html"))) errors.push("missing out/404.html");
if (errors.length) {
  console.error(`Export validation failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.info(`Export validation passed: ${publishedPages.length} pages, one H1 each, canonical URLs and internal links checked.`);
}
