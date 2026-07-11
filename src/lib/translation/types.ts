import type { Locale } from "@/db/schema";

export type GlossaryEntry = {
  sourceTerm: string;
  approvedTranslation: string;
  notes?: string | null;
  caseSensitive?: boolean;
};

export type TranslationRequest = {
  sourceLocale: Locale;
  targetLocale: Locale;
  content: Record<string, unknown>;
  schema?: Record<string, unknown>;
  glossary?: GlossaryEntry[];
};

export type TranslationResult = {
  content: Record<string, unknown>;
  provider: string;
  model: string;
  providerRequestId?: string;
};

export interface TranslationProvider {
  readonly name: string;
  translate(request: TranslationRequest): Promise<TranslationResult>;
}
