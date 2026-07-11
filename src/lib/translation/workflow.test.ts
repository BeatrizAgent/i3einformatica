import { describe, expect, it } from "vitest";

import { assertTransition, canMachineOverwrite, canTransition, isStale } from "./workflow";

describe("translation workflow", () => {
  it("requires review before approval and approval before publish", () => {
    expect(canTransition("machine_draft", "in_review")).toBe(true);
    expect(canTransition("in_review", "approved")).toBe(true);
    expect(canTransition("approved", "published")).toBe(true);
    expect(() => assertTransition("machine_draft", "published")).toThrow(/Invalid translation transition/);
  });

  it("protects human reviewed content from machine overwrite", () => {
    expect(canMachineOverwrite("missing")).toBe(true);
    expect(canMachineOverwrite("machine_draft")).toBe(true);
    expect(canMachineOverwrite("approved")).toBe(false);
    expect(canMachineOverwrite("published")).toBe(false);
  });

  it("detects translations behind the Spanish source revision", () => {
    expect(isStale(2, 3)).toBe(true);
    expect(isStale(3, 3)).toBe(false);
  });
});
