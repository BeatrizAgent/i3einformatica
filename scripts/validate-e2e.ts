import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pageHref, publishedPages } from "../src/lib/content/repository";

const out = join(process.cwd(), "out");
const errors: string[] = [];

function fileFor(href: string) {
  const clean = href.replace(/^\//, "").replace(/\/$/, "");
  return join(out, clean, "index.html");
}

function parseAttributes(tagContent: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const matches = tagContent.matchAll(/([\w\-]+)="([^"]*)"/g);
  for (const m of matches) {
    attrs[m[1].toLowerCase()] = m[2];
  }
  return attrs;
}

// 1. Audit Accessibility and Smoke E2E Criteria
for (const page of publishedPages) {
  const file = fileFor(pageHref(page));
  if (!existsSync(file)) {
    continue; // already handled by validate-export
  }
  const html = readFileSync(file, "utf8");
  const context = pageHref(page);

  // Check html lang matches page locale
  const htmlMatch = html.match(/<html\s+([^>]+)>/i);
  if (htmlMatch) {
    const attrs = parseAttributes(htmlMatch[1]);
    const lang = attrs.lang?.split("-")[0];
    if (lang !== page.locale) {
      errors.push(`${context}: html lang attribute "${lang}" does not match page locale "${page.locale}"`);
    }
  } else {
    errors.push(`${context}: missing <html> tag or lang attribute`);
  }

  // Check all images have alt attributes
  const imgMatches = html.matchAll(/<img\s+([^>]+)>/gi);
  for (const m of imgMatches) {
    const attrs = parseAttributes(m[1]);
    if (attrs.alt === undefined) {
      errors.push(`${context}: image is missing alt attribute (src: "${attrs.src}")`);
    }
  }

  // Check skip link and skip link target (#content)
  const skipLinkRegex = /href="#content"/i;
  const skipLinkTargetRegex = /(id="content"|name="content")/i;
  if (html.includes("skip-link") || skipLinkRegex.test(html)) {
    if (!skipLinkTargetRegex.test(html)) {
      errors.push(`${context}: skip link exists but target id="content" is missing`);
    }
  }

  // Check interactive elements (buttons, links) have accessible text or label
  const btnMatches = html.matchAll(/<button\s+([^>]*?)>([\s\S]*?)<\/button>/gi);
  for (const m of btnMatches) {
    const attrs = parseAttributes(m[1]);
    const text = m[2].trim();
    if (!text && !attrs["aria-label"] && !attrs["aria-labelledby"]) {
      errors.push(`${context}: button is empty and missing aria-label (attrs: ${m[1]})`);
    }
  }

  // Check form inputs have associated labels or accessible names
  const inputMatches = html.matchAll(/<input\s+([^>]+)>/gi);
  for (const m of inputMatches) {
    const attrs = parseAttributes(m[1]);
    if (attrs.type === "hidden" || attrs.type === "submit" || attrs.type === "checkbox") continue;
    if (!attrs.id && !attrs["aria-label"] && !attrs["aria-labelledby"]) {
      errors.push(`${context}: input field is missing identifier or accessible name (type: "${attrs.type}")`);
    }
    // If has id, verify there is a matching label
    if (attrs.id) {
      const labelRegex = new RegExp(`for="${attrs.id}"`, "i");
      if (!labelRegex.test(html) && !attrs["aria-label"] && !attrs["aria-labelledby"]) {
        errors.push(`${context}: input with id "${attrs.id}" has no associated <label for="${attrs.id}">`);
      }
    }
  }
}

// 2. Audit 404 Page Accessibility
const notFoundFile = join(out, "404.html");
if (existsSync(notFoundFile)) {
  const html = readFileSync(notFoundFile, "utf8");
  if (!html.includes("<h1>") && !html.includes("<h2>")) {
    errors.push("404.html: page has no headings");
  }
}

// 3. Report
if (errors.length) {
  console.error(`E2E/Accessibility validation failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.info("E2E/Accessibility validation passed: audited HTML elements, skip links, images, buttons, and form inputs successfully.");
}
