"use client";

import { useState } from "react";

type Translation = { id: string; locale: string; localizedPath: string; title: string; excerpt: string | null; seoTitle: string | null; seoDescription: string | null; content: Record<string, unknown>; status: string; sourceRevision: number };

export function TranslationEditor({ translation }: { translation: Translation }) {
  const [content, setContent] = useState(JSON.stringify(translation.content, null, 2));
  const [message, setMessage] = useState("");
  async function request(path: string, init: RequestInit) { const response = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init.headers ?? {}) } }); setMessage(response.ok ? "Guardado" : "Operación rechazada"); if (response.ok) window.location.reload(); }
  return <div className="translation-editor"><header className="admin-heading"><div><p className="eyebrow">{translation.locale.toUpperCase()} · {translation.status}</p><h1>{translation.title}</h1><p>Revisión fuente: {translation.sourceRevision}</p></div></header><form onSubmit={(event) => { event.preventDefault(); try { void request(`/api/admin/translations/${translation.id}`, { method: "PATCH", body: JSON.stringify({ localizedPath: new FormData(event.currentTarget).get("localizedPath"), title: new FormData(event.currentTarget).get("title"), content: JSON.parse(content) }) }); } catch { setMessage("JSON no válido"); } }}><label>Slug localizado<input name="localizedPath" defaultValue={translation.localizedPath} required /></label><label>Título<input name="title" defaultValue={translation.title} required /></label><label>Contenido JSON<textarea value={content} onChange={(event) => setContent(event.target.value)} rows={24} /></label><button className="button" type="submit">Guardar cambios</button></form><div className="admin-actions"><button onClick={() => void request(`/api/admin/translations/${translation.id}/generate`, { method: "POST" })}>Regenerar borrador</button>{["in_review", "approved", "published"].map((status) => <button key={status} onClick={() => void request(`/api/admin/translations/${translation.id}/transition`, { method: "POST", body: JSON.stringify({ status }) })}>{status}</button>)}</div><p role="status">{message}</p></div>;
}
