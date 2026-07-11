import { and, desc, eq, sql } from "drizzle-orm";

import { getDb, getPool } from "@/db";
import {
  auditLogs,
  pageSectionTranslations,
  pageTranslations,
  translationGlossary,
  translationJobs,
  translationRevisions,
  type Locale,
  type NewTranslationJob,
  type TranslationJob,
} from "@/db/schema";

import { OpenAITranslationProvider } from "./openai";
import type { TranslationProvider } from "./types";
import { canMachineOverwrite } from "./workflow";

const providers = new Map<string, () => TranslationProvider>([
  ["openai", () => new OpenAITranslationProvider()],
]);

export function registerTranslationProvider(name: string, factory: () => TranslationProvider): void {
  providers.set(name, factory);
}

export async function enqueueTranslationJob(input: NewTranslationJob): Promise<TranslationJob> {
  const db = getDb();
  const [inserted] = await db.insert(translationJobs).values(input).onConflictDoNothing().returning();
  if (inserted) return inserted;
  const [job] = await db.select().from(translationJobs).where(and(eq(translationJobs.targetType, input.targetType), eq(translationJobs.targetId, input.targetId), eq(translationJobs.targetLocale, input.targetLocale), eq(translationJobs.sourceRevision, input.sourceRevision))).limit(1);
  if (!job) throw new Error("Failed to enqueue or find translation job");
  return job;
}

type ClaimedRow = Omit<TranslationJob, "createdAt" | "updatedAt" | "runAfter" | "lockedAt" | "completedAt"> & {
  createdAt: Date;
  updatedAt: Date;
  runAfter: Date;
  lockedAt: Date | null;
  completedAt: Date | null;
};

async function claimJob(workerId: string): Promise<TranslationJob | null> {
  await getPool().query(
    `UPDATE translation_jobs SET status = 'failed', error = 'Worker lease expired after final attempt', locked_at = NULL, locked_by = NULL, updated_at = now()
     WHERE status = 'processing' AND locked_at < now() - interval '15 minutes' AND attempts >= max_attempts`,
  );
  const result = await getPool().query<ClaimedRow>(
    `WITH candidate AS (
       SELECT id FROM translation_jobs
       WHERE ((status = 'pending' AND run_after <= now())
          OR (status = 'processing' AND locked_at < now() - interval '15 minutes'))
         AND attempts < max_attempts
       ORDER BY run_after, created_at
       FOR UPDATE SKIP LOCKED
       LIMIT 1
     )
     UPDATE translation_jobs AS job
     SET status = 'processing', locked_at = now(), locked_by = $1,
         attempts = attempts + 1, updated_at = now()
     FROM candidate
     WHERE job.id = candidate.id
     RETURNING job.*`,
    [workerId],
  );
  const raw = result.rows[0] as (Record<string, unknown> & ClaimedRow) | undefined;
  if (!raw) return null;
  return {
    id: String(raw.id),
    provider: String(raw.provider),
    status: "processing",
    targetType: String(raw.target_type),
    targetId: String(raw.target_id),
    sourceLocale: String(raw.source_locale) as Locale,
    targetLocale: String(raw.target_locale) as Locale,
    sourceRevision: Number(raw.source_revision),
    input: raw.input as Record<string, unknown>,
    output: (raw.output as Record<string, unknown> | null) ?? null,
    attempts: Number(raw.attempts),
    maxAttempts: Number(raw.max_attempts),
    error: (raw.error as string | null) ?? null,
    lockedAt: raw.locked_at as Date,
    lockedBy: String(raw.locked_by),
    runAfter: raw.run_after as Date,
    completedAt: (raw.completed_at as Date | null) ?? null,
    createdBy: (raw.created_by as string | null) ?? null,
    createdAt: raw.created_at as Date,
    updatedAt: raw.updated_at as Date,
  };
}

async function glossaryFor(targetLocale: Locale) {
  return getDb()
    .select({
      sourceTerm: translationGlossary.sourceTerm,
      approvedTranslation: translationGlossary.approvedTranslation,
      notes: translationGlossary.notes,
      caseSensitive: translationGlossary.caseSensitive,
    })
    .from(translationGlossary)
    .where(eq(translationGlossary.targetLocale, targetLocale));
}

async function applyMachineDraft(job: TranslationJob, content: Record<string, unknown>): Promise<void> {
  const db = getDb();
  await db.transaction(async (tx) => {
    if (job.targetType === "page_translation") {
      const [current] = await tx
        .select()
        .from(pageTranslations)
        .where(eq(pageTranslations.id, job.targetId))
        .limit(1)
        .for("update");
      if (!current) throw new Error("Target page translation does not exist");
      if (!canMachineOverwrite(current.status)) throw new Error(`Protected translation status: ${current.status}`);
      const translatedContent =
        content.content && typeof content.content === "object" && !Array.isArray(content.content)
          ? (content.content as Record<string, unknown>)
          : content;
      await tx
        .update(pageTranslations)
        .set({
          title: typeof content.title === "string" ? content.title : current.title,
          excerpt: typeof content.excerpt === "string" ? content.excerpt : current.excerpt,
          seoTitle: typeof content.seoTitle === "string" ? content.seoTitle : current.seoTitle,
          seoDescription: typeof content.seoDescription === "string" ? content.seoDescription : current.seoDescription,
          ogTitle: typeof content.ogTitle === "string" ? content.ogTitle : current.ogTitle,
          ogDescription: typeof content.ogDescription === "string" ? content.ogDescription : current.ogDescription,
          content: translatedContent,
          status: "machine_draft",
          translatorType: "machine",
          sourceRevision: job.sourceRevision,
          updatedAt: new Date(),
        })
        .where(eq(pageTranslations.id, current.id));
    } else if (job.targetType === "page_section_translation") {
      const [current] = await tx
        .select()
        .from(pageSectionTranslations)
        .where(eq(pageSectionTranslations.id, job.targetId))
        .limit(1)
        .for("update");
      if (!current) throw new Error("Target page section translation does not exist");
      if (!canMachineOverwrite(current.status)) throw new Error(`Protected translation status: ${current.status}`);
      await tx
        .update(pageSectionTranslations)
        .set({ content, status: "machine_draft", translatorType: "machine", sourceRevision: job.sourceRevision, updatedAt: new Date() })
        .where(eq(pageSectionTranslations.id, current.id));
    } else {
      throw new Error(`Unsupported translation target: ${job.targetType}`);
    }

    const [latest] = await tx
      .select({ revision: translationRevisions.revision })
      .from(translationRevisions)
      .where(
        and(
          eq(translationRevisions.targetType, job.targetType),
          eq(translationRevisions.targetId, job.targetId),
          eq(translationRevisions.locale, job.targetLocale),
        ),
      )
      .orderBy(desc(translationRevisions.revision))
      .limit(1);
    const revision = (latest?.revision ?? 0) + 1;
    await tx.insert(translationRevisions).values({
      targetType: job.targetType,
      targetId: job.targetId,
      locale: job.targetLocale,
      revision,
      sourceRevision: job.sourceRevision,
      status: "machine_draft",
      translatorType: "machine",
      snapshot: content,
      translationJobId: job.id,
    });
    await tx.insert(auditLogs).values({
      action: "translation.machine_generated",
      entityType: job.targetType,
      entityId: job.targetId,
      metadata: { locale: job.targetLocale, sourceRevision: job.sourceRevision, provider: job.provider },
    });
    await tx
      .update(translationJobs)
      .set({ status: "completed", output: content, error: null, completedAt: new Date(), lockedAt: null, lockedBy: null, updatedAt: new Date() })
      .where(eq(translationJobs.id, job.id));
  });
}

function safeError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown translation error";
  return message.replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]").slice(0, 1_000);
}

async function failJob(job: TranslationJob, error: unknown): Promise<void> {
  const terminal = job.attempts >= job.maxAttempts;
  const delaySeconds = Math.min(900, 2 ** job.attempts * 15);
  await getDb()
    .update(translationJobs)
    .set({
      status: terminal ? "failed" : "pending",
      error: safeError(error),
      lockedAt: null,
      lockedBy: null,
      runAfter: terminal ? job.runAfter : sql`now() + (${delaySeconds} * interval '1 second')`,
      updatedAt: new Date(),
    })
    .where(eq(translationJobs.id, job.id));
}

export async function processNextTranslationJob(workerId = crypto.randomUUID()): Promise<TranslationJob | null> {
  const job = await claimJob(workerId);
  if (!job) return null;
  try {
    const factory = providers.get(job.provider);
    if (!factory) throw new Error(`Unknown translation provider: ${job.provider}`);
    const result = await factory().translate({
      sourceLocale: job.sourceLocale,
      targetLocale: job.targetLocale,
      content: job.input,
      glossary: await glossaryFor(job.targetLocale),
    });
    await applyMachineDraft(job, result.content);
  } catch (error) {
    await failJob(job, error);
  }
  return job;
}
