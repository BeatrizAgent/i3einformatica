import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/public-path";
import { getAsset, getPageContent, resolveAction } from "@/lib/page-content";
import type { PageRecord } from "@/lib/content/repository";
import { TechnologyBand } from "@/components/landing/technology-band";

type Locale = "es" | "en";

interface DetailBlockItem {
  title?: string;
  summary?: string;
  assetId?: string;
  details?: string[];
}

export function M365DetailPage({ page }: { page: PageRecord }) {
  const locale: Locale = page.locale === "en" ? "en" : "es";
  const content = getPageContent(page.id, locale);
  if (!content) return null;

  const parentHref = locale === "es" ? "/microsoft-365" : "/en/microsoft-365";
  const parentLabel = "Microsoft 365";
  const currentLabel = page.id.includes("products") || page.id.includes("producto")
    ? (locale === "es" ? "Producto" : "Product")
    : (locale === "es" ? "Soluciones" : "Solutions");

  // Fetch hero image
  const heroImage = content.hero.assetId ? getAsset(content.hero.assetId) : null;
  const heroCta = resolveAction(content.hero.cta, locale);

  // Find capabilities block
  const capBlock = content.blocks.find((b) => b.type === "capability_grid" || b.type === "outcome_grid");
  const processBlock = content.blocks.find((b) => b.type === "process_steps");
  
  const finalCtaAction = content.cta?.action ? resolveAction(content.cta.action, locale) : null;

  const capItems = (capBlock?.items ?? []) as unknown as DetailBlockItem[];
  const processItems = (processBlock?.items ?? []) as unknown as DetailBlockItem[];

  // Fallback images to prevent repeats
  const fallbackImages = [
    "/assets/i3e/migracion-min.webp",
    "/assets/i3e/migracion-sharepoint-min.webp",
    "/assets/i3e/copilot-min.webp",
    "/assets/i3e/soluciones-1024x768.webp",
    "/assets/i3e/equipo-tecnico-1024x683.webp"
  ];

  return (
    <div className="m365-detail-page">
      {/* Hero Section */}
      <section className="page-hero hero-with-visual" aria-labelledby="detail-title">
        <div className="shell hero-layout">
          <div className="hero-content">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href={locale === "es" ? "/" : "/en"}>{locale === "es" ? "Inicio" : "Home"}</Link>
              <span>/</span>
              <Link href={parentHref}>{parentLabel}</Link>
              <span>/</span>
              <span aria-current="page">{currentLabel}</span>
            </nav>
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1 id="detail-title">{content.hero.title}</h1>
            <p className="lead">{content.hero.intro}</p>
            {heroCta && (
              <div className="hero-actions">
                <Link className="button" href={heroCta.href}>{heroCta.label}</Link>
              </div>
            )}
          </div>
          {heroImage && (
            <div className="hero-visual" aria-hidden="true">
              <Image src={assetPath(heroImage.path)} alt="" fill priority sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: "cover" }} />
            </div>
          )}
        </div>
      </section>

      {/* Main Content Layout with Sticky Index */}
      {capBlock && (
        <section className="section detail-capabilities-section" aria-labelledby="capabilities-sec-title">
          <div className="shell">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Sticky Index Column */}
              <aside className="md:col-span-1">
                <nav className="anchored-index" aria-label={locale === "es" ? "Índice de contenido" : "Content index"}>
                  <p className="anchored-index-title">{locale === "es" ? "Índice" : "Index"}</p>
                  <ul className="anchored-index-list">
                    {capItems.map((item, index) => (
                      <li key={item.title || index}>
                        <a href={`#cap-${index}`}>{item.title}</a>
                      </li>
                    ))}
                    {processBlock && (
                      <li>
                        <a href="#process-sec">{processBlock.title}</a>
                      </li>
                    )}
                  </ul>
                </nav>
              </aside>

              {/* Capabilities Details Column */}
              <div className="md:col-span-3">
                <div id="capabilities-sec-title">
                  <p className="eyebrow">{capBlock.eyebrow}</p>
                  <h2 className="text-3xl font-bold mb-4">{capBlock.title}</h2>
                  {capBlock.intro && <p className="text-lg text-gray-600 mb-8">{capBlock.intro}</p>}
                </div>

                <div className="detail-alternate-layout">
                  {capItems.map((item, index) => {
                    const itemAsset = item.assetId ? getAsset(String(item.assetId)) : null;
                    const imageSrc = itemAsset ? assetPath(itemAsset.path) : assetPath(fallbackImages[index % fallbackImages.length]);

                    return (
                      <article id={`cap-${index}`} className="detail-alternate-item" key={item.title || index}>
                        <div className="detail-alternate-media">
                          <Image src={imageSrc} alt={item.title || ""} fill sizes="(max-width: 760px) 100vw, 30vw" style={{ objectFit: "cover" }} />
                        </div>
                        <div className="detail-alternate-copy">
                          <h3>{item.title}</h3>
                          <p>{item.summary}</p>
                          {item.details && Array.isArray(item.details) && (
                            <ul className="curated-card-list">
                              {item.details.map((detail: unknown) => (
                                <li key={String(detail)}>{String(detail)}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process steps section */}
      {processBlock && (
        <section id="process-sec" className="section section-muted curated-section" aria-labelledby="process-title">
          <div className="shell">
            <div className="curated-heading">
              <p className="eyebrow">{processBlock.eyebrow}</p>
              <h2 id="process-title">{processBlock.title}</h2>
              {processBlock.intro && <p>{processBlock.intro}</p>}
            </div>
            <ol className="curated-process-grid">
              {processItems.map((item, index) => (
                <li className="curated-process-step" key={item.title || index}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Technology Band */}
      <TechnologyBand locale={locale} />

      {/* Final CTA Section */}
      {content.cta && finalCtaAction && (
        <section className="cta curated-cta">
          <div className="shell cta-inner">
            <div>
              <p className="eyebrow">{content.cta.eyebrow}</p>
              <h2>{content.cta.title}</h2>
              <p>{content.cta.text}</p>
            </div>
            <Link className="button button-light" href={finalCtaAction.href}>
              {finalCtaAction.label}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
