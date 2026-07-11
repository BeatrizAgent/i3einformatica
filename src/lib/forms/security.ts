import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { formRateLimits } from "@/db/schema";

export function validateOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const expected = process.env.NEXT_PUBLIC_SITE_URL;
  if (expected) return new URL(origin).origin === new URL(expected).origin;
  return new URL(origin).host === request.headers.get("host");
}

export function getClientKey(request: Request) {
  if (process.env.TRUST_PROXY_HEADERS !== "true") return "shared-untrusted-network";
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function consumeRateLimit(key: string, limit = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const keyHash = createHash("sha256").update(`${process.env.SESSION_SECRET ?? "rate-limit"}:${key}`).digest("hex");
  return getDb().transaction(async (tx) => {
    const [current] = await tx.select().from(formRateLimits).where(eq(formRateLimits.keyHash, keyHash)).limit(1).for("update");
    if (!current || current.resetAt.getTime() <= now) {
      await tx.insert(formRateLimits).values({ keyHash, count: 1, resetAt: new Date(now + windowMs) }).onConflictDoUpdate({ target: formRateLimits.keyHash, set: { count: 1, resetAt: new Date(now + windowMs), updatedAt: new Date() } });
      return { allowed: true, retryAfter: 0 };
    }
    if (current.count >= limit) return { allowed: false, retryAfter: Math.ceil((current.resetAt.getTime() - now) / 1000) };
    await tx.update(formRateLimits).set({ count: current.count + 1, updatedAt: new Date() }).where(eq(formRateLimits.keyHash, keyHash));
    return { allowed: true, retryAfter: 0 };
  });
}

export async function validatePdf(file: File | null) {
  if (!file || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) throw new FormServiceError("El archivo supera 5 MB", 413);
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) throw new FormServiceError("Solo se admiten archivos PDF", 415);
  const signature = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  if (new TextDecoder().decode(signature) !== "%PDF-") throw new FormServiceError("El archivo no es un PDF válido", 415);
  return file;
}

export class FormServiceError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
