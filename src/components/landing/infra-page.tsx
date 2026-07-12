import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/public-path";
import { getAsset, getPageContent, resolveAction } from "@/lib/page-content";
import type { PageRecord } from "@/lib/content/repository";
import { TechnologyBand } from "@/components/landing/technology-band";

type Locale = "es" | "en";

interface InfraBlockItem {
  title?: string;
  summary?: string;
  assetId?: string;
}

export function InfraPage({ page }: { page: PageRecord }) {
  const locale: Locale = page.locale === "en" ? "en" : "es";
  const content = getPageContent("it-infrastructure", locale);
  if (!content) return null;

  const heroImage = content.hero.assetId ? getAsset(content.hero.assetId) : null;
  const heroBg = heroImage ? assetPath(heroImage.path) : assetPath("/assets/i3e/insfraestructuras-it-min.webp");
  const heroCta = resolveAction(content.hero.cta, locale);

  const outcomesBlock = content.blocks.find((b) => b.id === "outcomes");
  const processBlock = content.blocks.find((b) => b.id === "process");
  const finalCtaAction = content.cta?.action ? resolveAction(content.cta.action, locale) : null;

  const outcomeItems = (outcomesBlock?.items ?? []) as unknown as InfraBlockItem[];
  const processItems = (processBlock?.items ?? []) as unknown as InfraBlockItem[];

  return (
    <div className="infra-page">
      {/* Hero Section */}
      <section className="page-hero hero-with-visual" aria-labelledby="infra-title">
        <div className="shell hero-layout">
          <div className="hero-content">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1 id="infra-title">{content.hero.title}</h1>
            <p className="lead">{content.hero.intro}</p>
            {heroCta && (
              <div className="hero-actions">
                <Link className="button" href={heroCta.href}>{heroCta.label}</Link>
              </div>
            )}
          </div>
          {heroImage && (
            <div className="hero-visual" aria-hidden="true">
              <Image src={heroBg} alt="" fill priority sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: "cover" }} />
            </div>
          )}
        </div>
      </section>

      {/* 4 areas Section */}
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
                        <Image src={assetPath(itemAsset.path)} alt={item.title || ""} fill sizes="(max-width: 760px) 100vw, 30vw" style={{ objectFit: "cover" }} />
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

      {/* Process Section */}
      {processBlock && (
        <section className="section section-muted curated-section" aria-labelledby="process-title">
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
