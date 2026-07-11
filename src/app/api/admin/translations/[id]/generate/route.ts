import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { pages, pageTranslations } from "@/db/schema";
import { requireRole } from "@/lib/auth/session";
import { enqueueTranslationJob } from "@/lib/translation/jobs";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireRole("editor");
    const id = (await params).id;
    const [target] = await getDb().select().from(pageTranslations).where(eq(pageTranslations.id, id)).limit(1);
    if (!target || target.locale === "es") return Response.json({ error: "Invalid target translation" }, { status: 422 });
    const [source] = await getDb().select({ translation: pageTranslations, sourceRevision: pages.sourceRevision }).from(pageTranslations).innerJoin(pages, eq(pages.id, pageTranslations.pageId)).where(and(eq(pageTranslations.pageId, target.pageId), eq(pageTranslations.locale, "es"))).limit(1);
    if (!source) return Response.json({ error: "Spanish source is missing" }, { status: 409 });
    const job = await enqueueTranslationJob({
      provider: "openai",
      targetType: "page_translation",
      targetId: target.id,
      sourceLocale: "es",
      targetLocale: target.locale,
      sourceRevision: source.sourceRevision,
      input: {
        title: source.translation.title,
        excerpt: source.translation.excerpt,
        seoTitle: source.translation.seoTitle,
        seoDescription: source.translation.seoDescription,
        ogTitle: source.translation.ogTitle,
        ogDescription: source.translation.ogDescription,
        content: source.translation.content,
      },
      createdBy: actor.id,
    });
    return Response.json({ id: job.id, status: job.status }, { status: 202 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") return Response.json({ error: "Forbidden" }, { status: 403 });
    return Response.json({ error: "Could not enqueue translation" }, { status: 500 });
  }
}
