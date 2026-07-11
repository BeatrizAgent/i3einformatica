import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { pageTranslations } from "@/db/schema";
import { TranslationEditor } from "@/components/admin/translation-editor";
import { requireRole } from "@/lib/auth/session";

export default async function TranslationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("reviewer");
  const [translation] = await getDb().select().from(pageTranslations).where(eq(pageTranslations.id, (await params).id)).limit(1);
  if (!translation) notFound();
  return <TranslationEditor translation={translation} />;
}
