import type { PageTranslation } from "@/db/schema";

export type TranslationStatus = PageTranslation["status"];

const transitions: Record<TranslationStatus, readonly TranslationStatus[]> = {
  missing: ["machine_draft"],
  machine_draft: ["in_review", "machine_draft"],
  in_review: ["machine_draft", "approved"],
  approved: ["in_review", "published"],
  published: ["in_review"],
};

export function canTransition(from: TranslationStatus, to: TranslationStatus): boolean {
  return transitions[from].includes(to);
}

export function assertTransition(from: TranslationStatus, to: TranslationStatus): void {
  if (!canTransition(from, to)) throw new Error(`Invalid translation transition: ${from} -> ${to}`);
}

export function isStale(translationSourceRevision: number, currentSourceRevision: number): boolean {
  return translationSourceRevision < currentSourceRevision;
}

export function canMachineOverwrite(status: TranslationStatus): boolean {
  return status === "missing" || status === "machine_draft";
}
