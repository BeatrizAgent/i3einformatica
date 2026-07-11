import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, extname, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const BASE_URL = process.env.ASSETS_BASE_URL ?? "https://www.i3einformatica.com";
const OUTPUT_DIR = resolve(process.env.ASSETS_OUTPUT_DIR ?? "public/assets/i3e");
const RAW_DIR = resolve("data/audit/raw/site-assets");
const USER_AGENT = "i3e-site-asset-sync/1.0 (+internal migration)";

type SourceKind = "image" | "icon" | "favicon" | "apple-touch" | "og-image" | "media" | "stylesheet";
type Source = { url: string; kind: SourceKind };

function absolute(value: string, pageUrl: string) {
  try { return new URL(value, pageUrl).href; } catch { return null; }
}

function attr(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function add(set: Map<string, Source>, value: string | null, pageUrl: string, kind: SourceKind) {
  const url = value && absolute(value, pageUrl);
  if (!url || !/^https?:$/i.test(new URL(url).protocol)) return;
  if (new URL(url).protocol === "https:" || new URL(url).hostname === new URL(BASE_URL).hostname) {
    set.set(url, { url, kind });
  }
}

function kindForUrl(value: string, fallback: SourceKind) {
  return /\.(?:mp4|webm|ogg|ogv|mp3|wav|m4a|aac)(?:[?#].*)?$/i.test(value) ? "media" : fallback;
}

function collectCssUrls(css: string, stylesheetUrl: string, sources: Map<string, Source>) {
  for (const match of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)) {
    add(sources, match[1], stylesheetUrl, kindForUrl(match[1], "stylesheet"));
  }
  for (const match of css.matchAll(/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi)) {
    add(sources, match[1], stylesheetUrl, "stylesheet");
  }
}

function collectHtml(html: string, pageUrl: string, sources: Map<string, Source>, stylesheets: Set<string>) {
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    add(sources, attr(tag, "src") ?? attr(tag, "data-src") ?? attr(tag, "data-lazy-src"), pageUrl, "image");
    const srcset = attr(tag, "srcset") ?? attr(tag, "data-srcset");
    for (const candidate of srcset?.split(",") ?? []) add(sources, candidate.trim().split(/\s+/)[0], pageUrl, "image");
  }
  for (const tag of html.match(/<source\b[^>]*>/gi) ?? []) {
    for (const candidate of (attr(tag, "srcset") ?? "").split(",")) {
      const source = candidate.trim().split(/\s+/)[0];
      add(sources, source, pageUrl, kindForUrl(source, "image"));
    }
    const source = attr(tag, "src");
    add(sources, source, pageUrl, kindForUrl(source ?? "", "image"));
  }
  for (const tag of html.match(/<(?:video|audio|track)\b[^>]*>/gi) ?? []) {
    const source = attr(tag, "src");
    add(sources, source, pageUrl, "media");
    add(sources, attr(tag, "poster"), pageUrl, "image");
  }
  for (const tag of html.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi) ?? []) {
    const css = tag.replace(/^<style\b[^>]*>|<\/style>$/gi, "");
    collectCssUrls(css, pageUrl, sources);
  }
  for (const tag of html.match(/<[^>]+\bstyle\s*=[^>]*>/gi) ?? []) {
    collectCssUrls(attr(tag, "style") ?? "", pageUrl, sources);
  }
  for (const tag of html.match(/<(?:link|meta)\b[^>]*>/gi) ?? []) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase();
    const property = (attr(tag, "property") ?? attr(tag, "name") ?? "").toLowerCase();
    const value = attr(tag, "href") ?? attr(tag, "content");
    if (rel.includes("stylesheet")) {
      const url = value && absolute(value, pageUrl);
      if (url) stylesheets.add(url);
    } else if (rel.includes("icon")) add(sources, value, pageUrl, rel.includes("apple") ? "apple-touch" : "favicon");
    else if (property === "og:image" || property === "twitter:image") add(sources, value, pageUrl, "og-image");
    else if (rel === "preload" && (attr(tag, "as") ?? "") === "image") add(sources, value, pageUrl, "image");
  }
}

function outputName(url: string, used: Set<string>) {
  const parsed = new URL(url);
  let name = decodeURIComponent(basename(parsed.pathname)) || "asset";
  if (!extname(name)) name += ".bin";
  name = name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const original = name;
  if (used.has(name)) {
    const suffix = createHash("sha1").update(url).digest("hex").slice(0, 8);
    name = `${name.slice(0, -extname(name).length)}-${suffix}${extname(name)}`;
  }
  used.add(name);
  return { name, original };
}

async function fetchText(url: string) {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT }, redirect: "follow" });
  return { response, text: await response.text() };
}

async function main() {
  const sources = new Map<string, Source>();
  const stylesheets = new Set<string>();
  const sitemapUrl = new URL("/page-sitemap.xml", BASE_URL).href;
  const sitemapResponse = await fetchText(sitemapUrl);
  if (!sitemapResponse.response.ok) throw new Error(`Sitemap request failed: ${sitemapResponse.response.status}`);
  const pageUrls = [...sitemapResponse.text.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => match[1].trim())
    .filter((url) => url.startsWith("http"));
  for (const url of pageUrls) {
    try {
      const page = await fetchText(url);
      if (page.response.ok) collectHtml(page.text, page.response.url || url, sources, stylesheets);
    } catch (error) {
      console.warn(`SKIP page ${url}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  for (const stylesheetUrl of stylesheets) {
    try {
      const stylesheet = await fetchText(stylesheetUrl);
      if (stylesheet.response.ok) collectCssUrls(stylesheet.text, stylesheet.response.url || stylesheetUrl, sources);
    } catch (error) {
      console.warn(`SKIP stylesheet ${stylesheetUrl}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  for (const match of sitemapResponse.text.matchAll(/<image:loc>([\s\S]*?)<\/image:loc>/gi)) {
    add(sources, match[1].trim(), BASE_URL, "image");
  }

  await mkdir(RAW_DIR, { recursive: true });
  const usedNames = new Set<string>();
  const index: Array<Source & { originalName: string; rawName: string; bytes: number; sha256: string; contentType: string | null }> = [];
  for (const source of sources.values()) {
    let response: Response;
    try {
      response = await fetch(source.url, { headers: { "user-agent": USER_AGENT }, redirect: "follow" });
    } catch (error) {
      console.warn(`SKIP ${source.url}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    if (!response.ok) {
      console.warn(`SKIP ${response.status} ${source.url}`);
      continue;
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    const { name, original } = outputName(source.url, usedNames);
    const rawName = `${name.replace(/\.[^.]+$/, "")}-${createHash("sha1").update(source.url).digest("hex").slice(0, 8)}${extname(name)}`;
    await writeFile(resolve(RAW_DIR, rawName), bytes);
    index.push({ ...source, originalName: original, rawName, bytes: bytes.byteLength, sha256: createHash("sha256").update(bytes).digest("hex"), contentType: response.headers.get("content-type") });
    console.log(`GET ${bytes.byteLength.toLocaleString()} ${source.url}`);
  }
  const indexPath = resolve(RAW_DIR, "sources.json");
  await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  await mkdir(OUTPUT_DIR, { recursive: true });
  await execFileAsync("python", [resolve("scripts/optimize-assets.py"), "--input", RAW_DIR, "--output", OUTPUT_DIR, "--sources", indexPath]);
  console.log(`Assets written to ${OUTPUT_DIR}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
