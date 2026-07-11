import { and, desc, eq, sql } from "drizzle-orm";

import { getDb } from "./index";
import { auditLogs, pages, pageTranslations, translationRevisions } from "./schema";
import { assertTransition, type TranslationStatus } from "@/lib/translation/workflow";

type ActorContext = { userId: string; ipHash?: string };

export async function updateSpanishPageContent(
  translationId: string,
  content: Record<string, unknown>,
  actor: ActorContext,
): Promise<void> {
  await getDb().transaction(async (tx) => {
    const [translation] = await tx
      .select()
      .from(pageTranslations)
      .where(and(eq(pageTranslations.id, translationId), eq(pageTranslations.locale, "es")))
      .limit(1)
      .for("update");
    if (!translation) throw new Error("Spanish page translation not found");

    const [page] = await tx
      .update(pages)
      .set({ sourceRevision: sql`${pages.sourceRevision} + 1`, updatedBy: actor.userId, updatedAt: new Date() })
      .where(eq(pages.id, translation.pageId))
      .returning({ sourceRevision: pages.sourceRevision });
    if (!page) throw new Error("Translation page not found");

    await tx
      .update(pageTranslations)
      .set({ content, sourceRevision: page.sourceRevision, translatorType: "human", updatedBy: actor.userId, updatedAt: new Date() })
      .where(eq(pageTranslations.id, translation.id));

    const [latest] = await tx
      .select({ revision: translationRevisions.revision })
      .from(translationRevisions)
      .where(
        and(
          eq(translationRevisions.targetType, "page_translation"),
          eq(translationRevisions.targetId, translation.id),
          eq(translationRevisions.locale, "es"),
        ),
      )
      .orderBy(desc(translationRevisions.revision))
      .limit(1);
    await tx.insert(translationRevisions).values({
      targetType: "page_translation",
      targetId: translation.id,
      locale: "es",
      revision: (latest?.revision ?? 0) + 1,
      sourceRevision: page.sourceRevision,
      status: translation.status,
      translatorType: "human",
      snapshot: content,
      createdBy: actor.userId,
    });
    await tx.insert(auditLogs).values({
      actorUserId: actor.userId,
      action: "translation.source_updated",
      entityType: "page_translation",
      entityId: translation.id,
      metadata: { sourceRevision: page.sourceRevision },
      ipHash: actor.ipHash,
    });
  });
}

export async function transitionPageTranslation(
  translationId: string,
  to: TranslationStatus,
  actor: ActorContext,
): Promise<void> {
  await getDb().transaction(async (tx) => {
    const [translation] = await tx
      .select()
      .from(pageTranslations)
      .where(eq(pageTranslations.id, translationId))
      .limit(1)
      .for("update");
    if (!translation) throw new Error("Page translation not found");
    assertTransition(translation.status, to);

    await tx
      .update(pageTranslations)
      .set({
        status: to,
        publishedAt: to === "published" ? new Date() : translation.publishedAt,
        updatedBy: actor.userId,
        updatedAt: new Date(),
      })
      .where(eq(pageTranslations.id, translation.id));
    await tx.insert(auditLogs).values({
      actorUserId: actor.userId,
      action: `translation.${to}`,
      entityType: "page_translation",
      entityId: translation.id,
      metadata: { from: translation.status, to },
      ipHash: actor.ipHash,
    });
  });
}
