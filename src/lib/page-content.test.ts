import { describe, expect, it } from "vitest";

import { getPageContent, getPageDocument, pageContentById, resolveAction } from "./page-content";

const pageIds = [
  "home", "microsoft-365", "microsoft-365-products", "microsoft-365-solutions", "cybersecurity", "microsoft-azure",
  "it-infrastructure", "compliance", "success-stories", "about-us", "contact", "join-team", "complaints",
  "privacy-policy", "cookie-policy", "legal-notice",
];

describe("curated page content", () => {
  it("registers every page in both supported locales", () => {
    expect(Object.keys(pageContentById).sort()).toEqual([...pageIds].sort());
    for (const pageId of pageIds) {
      expect(getPageContent(pageId, "es")).not.toBeNull();
      expect(getPageContent(pageId, "en")).not.toBeNull();
    }
  });

  it("keeps block identity and order aligned between ES and EN", () => {
    for (const pageId of pageIds) {
      const document = getPageDocument(pageId)!;
      const es = document.locales.es.blocks.map((block) => `${block.id}:${block.type}`);
      const en = document.locales.en.blocks.map((block) => `${block.id}:${block.type}`);
      expect(en).toEqual(es);
    }
  });

  it("resolves every internal hero and CTA action", () => {
    for (const pageId of pageIds) {
      const document = getPageDocument(pageId)!;
      for (const locale of ["es", "en"] as const) {
        expect(resolveAction(document.locales[locale].hero.cta, locale)).not.toBeNull();
        if (document.locales[locale].cta) expect(resolveAction(document.locales[locale].cta.action, locale)).not.toBeNull();
      }
    }
  });

  it("supports the legacy runtime page ids as aliases", () => {
    expect(getPageContent("cyber", "es")?.hero.title).toBe(getPageContent("cybersecurity", "es")?.hero.title);
    expect(getPageContent("company", "en")?.hero.title).toBe(getPageContent("about-us", "en")?.hero.title);
    expect(getPageContent("privacy", "es")?.hero.title).toBe(getPageContent("privacy-policy", "es")?.hero.title);
  });

  it("publishes approved company stats while keeping unapproved proof blocks gated", () => {
    const about = getPageDocument("about-us")!;
    const cases = getPageDocument("success-stories")!;
    expect(about.locales.es.blocks.some((block) => block.type === "stats" && block.approvalStatus === "approved")).toBe(true);
    expect(cases.locales.es.blocks.find((block) => block.type === "proof_grid")?.approvalStatus).toBe("in_review");
  });
});
