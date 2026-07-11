import { FormServiceError, consumeRateLimit, getClientKey, validateOrigin } from "@/lib/forms/security";
import { submitForm, type FormKind } from "@/lib/forms/service";

const kinds = new Set<FormKind>(["contact", "jobs", "complaint"]);
const MAX_BODY_BYTES = 6 * 1024 * 1024;

async function readLimitedFormData(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!contentType?.toLowerCase().startsWith("multipart/form-data") || !request.body) throw new FormServiceError("Formato de solicitud no válido", 415);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) { await reader.cancel(); throw new FormServiceError("Solicitud demasiado grande", 413); }
    chunks.push(value);
  }
  return new Response(Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))), { headers: { "Content-Type": contentType } }).formData();
}

export async function POST(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!kinds.has(kind as FormKind)) return Response.json({ error: "Formulario no encontrado" }, { status: 404 });
  if (!validateOrigin(request)) return Response.json({ error: "Origen no permitido" }, { status: 403 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return Response.json({ error: "Solicitud demasiado grande" }, { status: 413 });
  const rate = await consumeRateLimit(`${kind}:${getClientKey(request)}`);
  if (!rate.allowed) return Response.json({ error: "Demasiados intentos" }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  try {
    const result = await submitForm(kind as FormKind, await readLimitedFormData(request));
    return Response.json({ ok: true, reference: result.reference }, { status: 201 });
  } catch (error) {
    if (error instanceof FormServiceError) return Response.json({ error: error.message }, { status: error.status });
    console.error("Form submission failed", { kind, error: error instanceof Error ? error.name : "unknown" });
    return Response.json({ error: "No se pudo procesar la solicitud" }, { status: 500 });
  }
}
