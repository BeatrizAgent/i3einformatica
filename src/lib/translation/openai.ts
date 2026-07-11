import OpenAI from "openai";

import type { TranslationProvider, TranslationRequest, TranslationResult } from "./types";

let client: OpenAI | undefined;

function getClient(): OpenAI {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required to process OpenAI translation jobs");
  client = new OpenAI({ apiKey });
  return client;
}

function parseObject(value: string): Record<string, unknown> {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Translation provider returned a non-object JSON value");
  }
  return parsed as Record<string, unknown>;
}

export class OpenAITranslationProvider implements TranslationProvider {
  readonly name = "openai";
  private readonly model: string;

  constructor(model = process.env.OPENAI_TRANSLATION_MODEL ?? "gpt-5.4-mini") {
    this.model = model;
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const response = await getClient().responses.create({
      model: this.model,
      instructions: [
        "You are a professional website translator.",
        `Translate JSON values from ${request.sourceLocale} to ${request.targetLocale}.`,
        "Return only a valid JSON object with exactly the same keys, nesting, arrays, numbers, booleans, nulls, URLs, HTML tags and placeholders.",
        "Translate only human-readable strings. Never invent, omit or summarize content.",
        "Apply every approved glossary entry exactly.",
      ].join(" "),
      input: JSON.stringify({
        glossary: request.glossary ?? [],
        schema: request.schema ?? {},
        content: request.content,
      }),
    });

    if (!response.output_text) throw new Error("Translation provider returned no text output");
    return {
      content: parseObject(response.output_text),
      provider: this.name,
      model: this.model,
      providerRequestId: response.id,
    };
  }
}
