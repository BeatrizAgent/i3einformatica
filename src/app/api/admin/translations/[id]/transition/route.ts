import { z } from "zod";
import { transitionPageTranslation } from "@/db/translations";
import { requireRole } from "@/lib/auth/session";

const schema = z.object({ status: z.enum(["machine_draft", "in_review", "approved", "published"]) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Invalid status" }, { status: 422 });
  try {
    const actor = await requireRole(body.data.status === "published" ? "admin" : "reviewer");
    await transitionPageTranslation((await params).id, body.data.status, { userId: actor.id });
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") return Response.json({ error: "Forbidden" }, { status: 403 });
    return Response.json({ error: "Transition rejected" }, { status: 409 });
  }
}
