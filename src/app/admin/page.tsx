import Link from "next/link";
import { getAdminMatrix } from "@/lib/admin/read-model";
import { locales } from "@/lib/content/repository";

const statusLabel: Record<string, string> = { missing: "Pendiente", machine_draft: "Borrador IA", in_review: "En revisión", approved: "Aprobado", published: "Publicado" };

export default async function AdminPage() {
  const rows = await getAdminMatrix();

  let publishedCount = 0;
  let pendingReviewCount = 0;
  const totalCount = rows.length * locales.length;

  for (const row of rows) {
    for (const locale of locales) {
      const status = row.locales[locale];
      if (status === "published") {
        publishedCount++;
      } else if (status === "in_review" || status === "machine_draft") {
        pendingReviewCount++;
      }
    }
  }

  return (
    <>
      <header className="admin-heading">
        <div>
          <p className="eyebrow">Panel editorial</p>
          <h1>Contenido e idiomas</h1>
          <p>Estado real de páginas y traducciones almacenadas en PostgreSQL.</p>
        </div>
      </header>
      <div className="admin-stats">
        <article>
          <strong>{rows.length}</strong>
          <span>Páginas</span>
        </article>
        <article>
          <strong>{publishedCount} / {totalCount}</strong>
          <span>Traducciones publicadas</span>
        </article>
        <article>
          <strong>{pendingReviewCount}</strong>
          <span>Revisiones pendientes</span>
        </article>
      </div>
      <div className="table-wrap">
        <table>
          <caption className="sr-only">Matriz de páginas e idiomas</caption>
          <thead>
            <tr>
              <th>Página</th>
              {locales.map((locale) => (
                <th key={locale}>{locale.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th>
                  <span>{row.title}</span>
                  <small>Rev. {row.sourceRevision}</small>
                </th>
                {locales.map((locale) => {
                  const status = row.locales[locale];
                  const previewPath = row.paths[locale] ?? row.paths.es;
                  const translationId = row.translationIds[locale];
                  const href = translationId
                    ? `/admin/translations/${translationId}`
                    : status === "published"
                    ? `/preview/${locale}/${previewPath}`
                    : "#";
                  return (
                    <td key={locale}>
                      <Link
                        className={`status status-${status}`}
                        href={href}
                        aria-disabled={href === "#"}
                      >
                        {statusLabel[status] ?? status}
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
