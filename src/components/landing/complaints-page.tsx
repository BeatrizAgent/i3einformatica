import type { PageRecord } from "@/lib/content/repository";
import { getPageContent, type ContentLocale } from "@/lib/page-content";

function localeFor(page: PageRecord): ContentLocale {
  return page.locale === "en" ? "en" : "es";
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function ComplaintsPage({ page }: { page: PageRecord }) {
  const locale = localeFor(page);
  const content = getPageContent(page.id, locale);
  const block = content?.blocks.find((candidate) => candidate.type === "form");
  const alternative = block?.items?.[0] ?? {};
  const es = locale === "es";

  return (
    <section className="complaints-page" aria-labelledby="complaints-title">
      <div className="shell complaints-page-shell">
        <header className="complaints-page-intro">
          <p className="complaints-kicker">{content?.hero.eyebrow ?? page.eyebrow}</p>
          <h1 id="complaints-title">{content?.hero.title ?? page.title}</h1>
          <p className="complaints-lead">{content?.hero.intro ?? page.intro}</p>
        </header>

        <div className="complaints-panel" role="region" aria-labelledby="complaints-panel-title">
          <div className="complaints-panel-heading">
            <span className="complaints-panel-index" aria-hidden="true">01</span>
            <div>
              <p className="complaints-kicker">{block?.eyebrow ?? (es ? "Canal temporal" : "Temporary channel")}</p>
              <h2 id="complaints-panel-title">{block?.title ?? (es ? "No env\u00edes aqu\u00ed una denuncia" : "Do not submit a report here")}</h2>
            </div>
          </div>

          <p className="complaints-form-intro">{block?.intro}</p>
          <div className="complaints-warning" role="note">
            <span className="complaints-warning-icon" aria-hidden="true">!</span>
            <p>{es
              ? "Este sitio no recoge denuncias, datos personales ni documentos. El canal digital permanecerá cerrado hasta que exista una infraestructura independiente y segura."
              : "This site does not collect reports, personal data, or documents. The digital channel will remain closed until independent, secure infrastructure is available."}</p>
          </div>

          <div className="complaints-alternative">
            <div>
              <p className="complaints-label">{stringValue(alternative.title) || (es ? "Alternativa disponible" : "Available alternative")}</p>
              <p>{stringValue(alternative.summary)}</p>
            </div>
            <address>
              <strong>{es ? "Domicilio social" : "Registered office"}</strong>
              <span>{stringValue(alternative.address)}</span>
            </address>
          </div>

          <p className="complaints-source-note">{block?.sourceNote}</p>
        </div>
      </div>
    </section>
  );
}
