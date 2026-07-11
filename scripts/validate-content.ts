import { existsSync } from "node:fs";
import { resolve } from "node:path";

import assetCatalog from "../data/content/assets.json";
import { getPageDocument, pageContentById, resolveAction, type ContentLocale, type CuratedBlock } from "../src/lib/page-content";

const expectedPageIds = [
  "home", "microsoft-365", "microsoft-365-products", "microsoft-365-solutions", "cybersecurity", "microsoft-azure",
  "it-infrastructure", "compliance", "success-stories", "about-us", "contact", "join-team", "complaints",
  "privacy-policy", "cookie-policy", "legal-notice",
];
const blockTypes = new Set(["outcome_grid", "capability_grid", "process_steps", "timeline", "split_media", "proof_grid", "logo_grid", "stats", "form", "locations", "rich_text", "cta"]);
const badText = /[ÃÂ�]/;
const html = /<\/?[a-z][^>]*>/i;
const errors: string[] = [];
const warnings: string[] = [];

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

function assetIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(assetIds);
  if (!value || typeof value !== "object") return [];
  const object = value as Record<string, unknown>;
  return [
    ...(typeof object.assetId === "string" ? [object.assetId] : []),
    ...Object.values(object).flatMap(assetIds),
  ];
}

function checkAction(action: unknown, locale: ContentLocale, context: string) {
  if (!action || typeof action !== "object") return;
  const candidate = action as { label?: unknown; routeId?: unknown; href?: unknown };
  if (typeof candidate.label !== "string" || !candidate.label.trim()) errors.push(`${context}: action label is required`);
  if (typeof candidate.routeId !== "string" && typeof candidate.href !== "string") errors.push(`${context}: action needs routeId or href`);
  if (resolveAction(action as { label: string; routeId?: string; href?: string }, locale) === null) errors.push(`${context}: action destination does not resolve`);
}

function checkBlock(block: CuratedBlock, locale: ContentLocale, context: string) {
  if (!block.id || !block.type) errors.push(`${context}: block id and type are required`);
  if (!blockTypes.has(block.type)) errors.push(`${context}: unsupported block type ${block.type}`);
  if (block.action) checkAction(block.action, locale, `${context}.action`);
  if (block.type === "stats") {
    for (const item of block.items ?? []) {
      if (typeof item.value !== "string" || !item.value.trim() || typeof item.sourceNote !== "string" || !item.sourceNote.trim() || typeof item.verifiedAt !== "string" || !item.verifiedAt.trim()) {
        errors.push(`${context}: every stat needs value, sourceNote and verifiedAt`);
      }
    }
  }
  if (block.type === "proof_grid") {
    for (const item of block.items ?? []) {
      if (item.approvalStatus !== "approved") warnings.push(`${context}: proof item is blocked until approved`);
      for (const key of ["challenge", "approach", "result"]) {
        if (typeof item[key] !== "string" || !item[key]) errors.push(`${context}: proof item needs ${key}`);
      }
    }
  }
}

for (const pageId of expectedPageIds) {
  const document = getPageDocument(pageId);
  if (!document) {
    errors.push(`missing page document: ${pageId}`);
    continue;
  }
  if (document.schemaVersion !== 2 || document.pageId !== pageId) errors.push(`${pageId}: invalid schemaVersion or pageId`);
  for (const locale of ["es", "en"] as const) {
    const content = document.locales[locale];
    if (!content) {
      errors.push(`${pageId}: missing locale ${locale}`);
      continue;
    }
    if (!content.path.startsWith("/")) errors.push(`${pageId}.${locale}: path must start with /`);
    checkAction(content.hero.cta, locale, `${pageId}.${locale}.hero`);
    for (const block of content.blocks) checkBlock(block, locale, `${pageId}.${locale}.${block.id}`);
    if (content.cta) checkAction(content.cta.action, locale, `${pageId}.${locale}.cta`);
    for (const value of strings(content)) {
      if (badText.test(value)) errors.push(`${pageId}.${locale}: mojibake detected`);
      if (html.test(value)) errors.push(`${pageId}.${locale}: raw HTML detected`);
    }
    const ids = content.blocks.map((block) => block.id);
    if (new Set(ids).size !== ids.length) errors.push(`${pageId}.${locale}: duplicate block id`);
  }
  const esTypes = document.locales.es.blocks.map((block) => `${block.id}:${block.type}`);
  const enTypes = document.locales.en.blocks.map((block) => `${block.id}:${block.type}`);
  if (JSON.stringify(esTypes) !== JSON.stringify(enTypes)) errors.push(`${pageId}: ES/EN block structure differs`);
  for (const assetId of [...new Set(assetIds(document))]) {
    const asset = assetCatalog.assets.find((candidate) => candidate.id === assetId);
    if (!asset) {
      errors.push(`${pageId}: unknown assetId ${assetId}`);
      continue;
    }
    if (!existsSync(resolve(process.cwd(), "public", asset.path.replace(/^\//, "")))) errors.push(`${pageId}: missing asset file ${asset.path}`);
    if (asset.licenseStatus !== "approved") warnings.push(`${pageId}: asset ${assetId} is not publishable yet`);
  }
  if (document.editorialStatus === "published" && warnings.some((warning) => warning.startsWith(`${pageId}:`))) errors.push(`${pageId}: published content has blocked editorial dependencies`);
}

const loadedIds = Object.keys(pageContentById).sort();
if (JSON.stringify(loadedIds) !== JSON.stringify([...expectedPageIds].sort())) errors.push("page registry does not match the expected 16 pages");

if (warnings.length) console.warn(`Content warnings (${warnings.length}):\n- ${warnings.join("\n- ")}`);
if (errors.length) {
  console.error(`Content validation failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.info(`Content validation passed: ${expectedPageIds.length} pages, ES/EN parity, block allowlist, actions and assets checked.`);
}
