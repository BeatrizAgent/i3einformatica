import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { auditLogs, pageTranslations, translationRevisions } from "@/db/schema";
import { updateSpanishPageContent } from "@/db/translations";
import { requireRole } from "@/lib/auth/session";

const schema = z.object({
  localizedPath: z.string().startsWith("/").max(500).optional(),
  title: z.string().trim().min(1).max(300).optional(),
  excerpt: z.string().max(2_000).nullable().optional(),
  seoTitle: z.string().max(300).nullable().optional(),
  seoDescription: z.string().max(500).nullable().optional(),
  content: z.record(z.string(), z.unknown()),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid translation payload" }, { status: 422 });
  try {
    const actor = await requireRole("editor");
    const id = (await params).id;
    const [current] = await getDb().select().from(pageTranslations).where(eq(pageTranslations.id, id)).limit(1);
    if (!current) return Response.json({ error: "Translation not found" }, { status: 404 });

    if (current.locale === "es") {
      await updateSpanishPageContent(id, body.data.content, { userId: actor.id });
      await getDb().update(pageTranslations).set({ localizedPath: body.data.localizedPath ?? current.localizedPath, title: body.data.title ?? current.title, excerpt: body.data.excerpt ?? current.excerpt, seoTitle: body.data.seoTitle ?? current.seoTitle, seoDescription: body.data.seoDescription ?? current.seoDescription, updatedAt: new Date(), updatedBy: actor.id }).where(eq(pageTranslations.id, id));
    } else {
      await getDb().transaction(async (tx) => {
        const [latest] = await tx.select({ revision: translationRevisions.revision }).from(translationRevisions).where(and(eq(translationRevisions.targetType, "page_translation"), eq(translationRevisions.targetId, id), eq(translationRevisions.locale, current.locale))).orderBy(desc(translationRevisions.revision)).limit(1);
        const translatorType = current.translatorType === "machine" ? "human_edited_machine" as const : "human" as const;
        await tx.update(pageTranslations).set({ localizedPath: body.data.localizedPath ?? current.localizedPath, title: body.data.title ?? current.title, excerpt: body.data.excerpt ?? current.excerpt, seoTitle: body.data.seoTitle ?? current.seoTitle, seoDescription: body.data.seoDescription ?? current.seoDescription, content: body.data.content, translatorType, updatedAt: new Date(), updatedBy: actor.id }).where(eq(pageTranslations.id, id));
        await tx.insert(translationRevisions).values({ targetType: "page_translation", targetId: id, locale: current.locale, revision: (latest?.revision ?? 0) + 1, sourceRevision: current.sourceRevision, status: current.status, translatorType, snapshot: body.data, createdBy: actor.id });
        await tx.insert(auditLogs).values({ actorUserId: actor.id, action: "translation.manually_edited", entityType: "page_translation", entityId: id, metadata: { locale: current.locale } });
      });
    }
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") return Response.json({ error: "Forbidden" }, { status: 403 });
    return Response.json({ error: "Translation update failed" }, { status: 409 });
  }
}
