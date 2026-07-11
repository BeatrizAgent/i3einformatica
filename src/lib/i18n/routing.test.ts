import { describe, expect, it } from "vitest";

import { buildLocalizedPath, normalizePath, parseLocalizedPath } from "./routing";

describe("localized routing", () => {
  it("keeps Spanish unprefixed", () => {
    expect(parseLocalizedPath("/contacto/")).toMatchObject({ locale: "es", localizedPath: "/contacto" });
    expect(buildLocalizedPath("es", "/contacto/")).toBe("/contacto");
  });

  it("extracts supported locale prefixes", () => {
    expect(parseLocalizedPath("/en/contact/")).toMatchObject({ locale: "en", localizedPath: "/contact" });
    expect(buildLocalizedPath("en", "/contact")).toBe("/en/contact");
  });

  it("normalizes slashes, queries and root", () => {
    expect(normalizePath("//microsoft-365///?a=1")).toBe("/microsoft-365");
    expect(buildLocalizedPath("fr", "/")).toBe("/fr");
  });
});
