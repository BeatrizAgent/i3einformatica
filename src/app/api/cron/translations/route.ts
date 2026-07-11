import { processNextTranslationJob } from "@/lib/translation/jobs";

export async function POST(request: Request) {
  const expected = process.env.TRANSLATION_CRON_SECRET;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || provided !== expected) return Response.json({ error: "Unauthorized" }, { status: 401 });
  let processed = 0;
  for (; processed < 10; processed += 1) {
    const job = await processNextTranslationJob(`cron:${crypto.randomUUID()}`);
    if (!job) break;
  }
  return Response.json({ processed });
}
