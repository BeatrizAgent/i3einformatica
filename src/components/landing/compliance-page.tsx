import Image from "next/image";
import Link from "next/link";
import { getAsset, getPageContent, resolveAction } from "@/lib/page-content";
import type { PageRecord } from "@/lib/content/repository";
import { TechnologyBand } from "@/components/landing/technology-band";

type Locale = "es" | "en";

interface ComplianceBlockItem {
  title?: string;
  summary?: string;
  assetId?: string;
  details?: string[];
}

export function CompliancePage({ page }: { page: PageRecord }) {
  const locale: Locale = page.locale === "en" ? "en" : "es";
  const content = getPageContent("compliance", locale);
  if (!content) return null;

  const heroImage = content.hero.assetId ? getAsset(content.hero.assetId) : null;
  const heroCta = resolveAction(content.hero.cta, locale);

  const outcomesBlock = content.blocks.find((b) => b.id === "outcomes");
  const capabilitiesBlock = content.blocks.find((b) => b.id === "capabilities");
  const finalCtaAction = content.cta?.action ? resolveAction(content.cta.action, locale) : null;

  const outcomeItems = (outcomesBlock?.items ?? []) as unknown as ComplianceBlockItem[];
  const capItems = (capabilitiesBlock?.items ?? []) as unknown as ComplianceBlockItem[];

  // Fallback images to prevent repeats
  const fallbackImages = [
    "/assets/i3e/implementacion-normativas-min.webp",
    "/assets/i3e/migracion-min.webp",
    "/assets/i3e/copilot-min.webp",
    "/assets/i3e/soluciones-1024x768.webp"
  ];

  return (
    <div className="compliance-page">
      {/* Hero Section */}
      <section className="page-hero hero-with-visual" aria-labelledby="compliance-title">
        <div className="shell hero-layout">
          <div className="hero-content">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1 id="compliance-title">{content.hero.title}</h1>
            <p className="lead">{content.hero.intro}</p>
            {heroCta && (
              <div className="hero-actions">
                <Link className="button" href={heroCta.href}>{heroCta.label}</Link>
              </div>
            )}
          </div>
          {heroImage && (
            <div className="hero-visual" aria-hidden="true">
              <Image src={heroImage.path} alt="" fill priority sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: "cover" }} />
            </div>
          )}
        </div>
      </section>

      {/* Scope Disclaimer Banner */}
      <section className="section py-6 bg-slate-50 border-y border-slate-100" aria-label="Aviso de alcance">
        <div className="shell">
          <div className="p-5 bg-sky-50/50 border border-sky-100 rounded-lg flex items-start gap-4">
            <span className="text-xl leading-none mt-0.5" aria-hidden="true">ℹ️</span>
            <div>
              <p className="text-sm leading-relaxed text-sky-950 font-medium">
                {locale === "es"
                  ? "Nota de alcance: i3e Informática realiza consultoría de acompañamiento, implantación y preparación del entorno técnico. Las certificaciones oficiales (ISO/ENS) son emitidas única y exclusivamente por entidades auditoras acreditadas independientes."
                  : "Scope notice: i3e Informática provides consulting, implementation, and technical preparation services. Official certifications (ISO/ENS) are issued exclusively by independent accredited auditing bodies."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      {outcomesBlock && (
        <section className="section curated-section" aria-labelledby="outcomes-title">
          <div className="shell">
            <div className="curated-heading">
              <p className="eyebrow">{outcomesBlock.eyebrow}</p>
              <h2 id="outcomes-title">{outcomesBlock.title}</h2>
              {outcomesBlock.intro && <p>{outcomesBlock.intro}</p>}
            </div>

            <div className="curated-card-grid">
              {outcomeItems.map((item, index) => {
                const itemAsset = item.assetId ? getAsset(String(item.assetId)) : null;

                return (
                  <article className="curated-card" key={item.title || index}>
                    {itemAsset && (
                      <div className="curated-media">
                        <Image src={itemAsset.path} alt={item.title || ""} fill sizes="(max-width: 760px) 100vw, 30vw" style={{ objectFit: "cover" }} />
                      </div>
                    )}
                    <div className="curated-card-copy">
                      <span className="curated-card-index" aria-hidden="true">0{index + 1}</span>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.summary}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Layout with Sticky Index */}
      {capabilitiesBlock && (
        <section className="section detail-capabilities-section section-muted" aria-labelledby="capabilities-sec-title">
          <div className="shell">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Sticky Index Column */}
              <aside className="md:col-span-1">
                <nav className="anchored-index" aria-label={locale === "es" ? "Índice de ámbitos" : "Areas index"}>
                  <p className="anchored-index-title">{locale === "es" ? "Ámbitos" : "Areas"}</p>
                  <ul className="anchored-index-list">
                    {capItems.map((item, index) => (
                      <li key={item.title || index}>
                        <a href={`#cap-${index}`}>{item.title}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              {/* Capabilities Details Column */}
              <div className="md:col-span-3">
                <div id="capabilities-sec-title">
                  <p className="eyebrow">{capabilitiesBlock.eyebrow}</p>
                  <h2 className="text-3xl font-bold mb-4">{capabilitiesBlock.title}</h2>
                </div>

                <div className="detail-alternate-layout">
                  {capItems.map((item, index) => {
                    const itemAsset = item.assetId ? getAsset(String(item.assetId)) : null;
                    const imageSrc = itemAsset ? itemAsset.path : fallbackImages[index % fallbackImages.length];

                    return (
                      <article id={`cap-${index}`} className="detail-alternate-item scroll-mt-24" key={item.title || index}>
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
