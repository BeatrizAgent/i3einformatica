import "server-only";

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { complaintSubmissions, contactSubmissions, jobApplications, submissionAttachments } from "@/db/schema";
import { FormServiceError, validatePdf } from "@/lib/forms/security";
import { sendSubmissionNotification } from "@/lib/mail/mailer";
import { scanBuffer } from "@/lib/security/clamav";
import { decryptSensitiveJson, encryptSensitiveJson } from "@/lib/security/encryption";
import { deletePrivateObject, putPrivateObject } from "@/lib/storage/s3";

export type FormKind = "contact" | "jobs" | "complaint";
const locale = z.enum(["es", "ca", "eu", "gl", "pt", "en", "fr", "de"]);
const base = { locale, consent: z.literal("true"), website: z.string().max(0), submissionToken: z.string().min(2).max(200) };
const schemas = {
  contact: z.object({ ...base, name: z.string().trim().min(2).max(100), email: z.string().trim().email().max(254), phone: z.string().trim().max(40).optional(), message: z.string().trim().min(20).max(5000) }),
  jobs: z.object({ ...base, name: z.string().trim().min(2).max(100), surname: z.string().trim().min(2).max(120), email: z.string().trim().email().max(254), phone: z.string().trim().max(40).optional(), identity: z.string().trim().min(5).max(24), message: z.string().trim().min(20).max(5000) }),
  complaint: z.object({ ...base, reportType: z.enum(["irregularity", "complaint"]), queryType: z.enum(["unregistered-worker", "unpaid-overtime", "workplace-harassment", "sexual-harassment", "false-self-employment", "other"]), message: z.string().trim().min(20).max(5000) }),
};

function stringValue(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

function retentionDate(kind: FormKind) {
  const defaults = { contact: 365, jobs: 180, complaint: 1825 };
  const envKey = `RETENTION_${kind.toUpperCase()}_DAYS`;
  const days = Number(process.env[envKey] ?? defaults[kind]);
  return new Date(Date.now() + days * 86_400_000);
}

async function prepareAttachment(form: FormData) {
  const value = form.get("attachment");
  const file = await validatePdf(value instanceof File ? value : null);
  if (!file) return null;
  const body = new Uint8Array(await file.arrayBuffer());
  await scanBuffer(body);
  const checksum = createHash("sha256").update(body).digest("hex");
  return { file, body, checksum };
}

async function persistAttachment(owner: { contactSubmissionId?: string; jobApplicationId?: string; complaintSubmissionId?: string }, prepared: NonNullable<Awaited<ReturnType<typeof prepareAttachment>>>) {
  const key = `submissions/${new Date().getUTCFullYear()}/${randomUUID()}.pdf`;
  await putPrivateObject({ key, body: prepared.body, contentType: "application/pdf", checksumSha256: prepared.checksum });
  try {
    await getDb().insert(submissionAttachments).values({ ...owner, storageKey: key, originalFilename: prepared.file.name.slice(0, 255), mimeType: "application/pdf", byteSize: prepared.file.size, checksum: prepared.checksum, status: "clean", scannedAt: new Date() });
  } catch (error) {
    await deletePrivateObject(key).catch(() => undefined);
    throw error;
  }
}

export async function submitForm(kind: FormKind, form: FormData) {
  const fields = Object.fromEntries([...form.keys()].filter((key) => key !== "attachment").map((key) => [key, stringValue(form, key)]));
  const parsed = schemas[kind].safeParse(fields);
  if (!parsed.success) throw new FormServiceError("Datos de formulario no válidos", 422);
  const idempotencyKeyHash = createHash("sha256").update(parsed.data.submissionToken).digest("hex");
  if (kind === "contact") { const [existing] = await getDb().select({ id: contactSubmissions.id }).from(contactSubmissions).where(eq(contactSubmissions.idempotencyKeyHash, idempotencyKeyHash)).limit(1); if (existing) return { id: existing.id, reference: existing.id }; }
  if (kind === "jobs") { const [existing] = await getDb().select({ id: jobApplications.id }).from(jobApplications).where(eq(jobApplications.idempotencyKeyHash, idempotencyKeyHash)).limit(1); if (existing) return { id: existing.id, reference: existing.id }; }
  if (kind === "complaint") { const [existing] = await getDb().select({ id: complaintSubmissions.id, encryptedPayload: complaintSubmissions.encryptedPayload }).from(complaintSubmissions).where(eq(complaintSubmissions.idempotencyKeyHash, idempotencyKeyHash)).limit(1); if (existing) { const payload = decryptSensitiveJson<{ reference?: string }>(existing.encryptedPayload); return { id: existing.id, reference: payload.reference ?? existing.id }; } }
  const attachment = await prepareAttachment(form);
  if (kind === "contact" && attachment) throw new FormServiceError("El formulario de contacto no admite archivos", 422);
  const retentionUntil = retentionDate(kind);
  let id: string;
  let reference: string | undefined;

  if (kind === "contact") {
    const data = schemas.contact.parse(fields);
    const [row] = await getDb().insert(contactSubmissions).values({ idempotencyKeyHash, name: data.name, email: data.email, phone: data.phone || null, message: data.message, locale: data.locale, consent: true, retentionUntil }).returning({ id: contactSubmissions.id });
    id = row.id;
    if (attachment) await persistAttachment({ contactSubmissionId: id }, attachment);
  } else if (kind === "jobs") {
    const data = schemas.jobs.parse(fields);
    if (!attachment) throw new FormServiceError("El CV es obligatorio", 422);
    const [row] = await getDb().insert(jobApplications).values({ idempotencyKeyHash, name: `${data.name} ${data.surname}`, email: data.email, phone: data.phone || null, message: data.message, encryptedIdentity: encryptSensitiveJson({ identity: data.identity }), locale: data.locale, consent: true, retentionUntil }).returning({ id: jobApplications.id });
    id = row.id;
    try { await persistAttachment({ jobApplicationId: id }, attachment); } catch (error) { await getDb().delete(jobApplications).where(eq(jobApplications.id, id)); throw error; }
  } else {
    const data = schemas.complaint.parse(fields);
    reference = randomBytes(12).toString("base64url").toUpperCase();
    const [row] = await getDb().insert(complaintSubmissions).values({ idempotencyKeyHash, referenceCodeHash: createHash("sha256").update(reference).digest("hex"), encryptedPayload: encryptSensitiveJson({ reference, reportType: data.reportType, queryType: data.queryType, message: data.message }), locale: data.locale, consent: true, retentionUntil }).returning({ id: complaintSubmissions.id });
    id = row.id;
    if (attachment) { try { await persistAttachment({ complaintSubmissionId: id }, attachment); } catch (error) { await getDb().delete(complaintSubmissions).where(eq(complaintSubmissions.id, id)); throw error; } }
  }

  void sendSubmissionNotification({ subject: `Nueva solicitud web: ${kind}`, summary: `Referencia interna: ${id}`, adminPath: `/admin/submissions/${kind}/${id}` }).catch((error: unknown) => console.error("Notification delivery failed", { kind, error: error instanceof Error ? error.name : "unknown" }));
  return { id, reference: reference ?? id };
}
