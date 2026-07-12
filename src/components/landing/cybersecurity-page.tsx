import Image from "next/image";
import Link from "next/link";
import { getAsset, getPageContent, resolveAction } from "@/lib/page-content";
import type { PageRecord } from "@/lib/content/repository";
import { TechnologyBand } from "@/components/landing/technology-band";

type Locale = "es" | "en";

interface CyberBlockItem {
  title?: string;
  summary?: string;
  assetId?: string;
}

export function CybersecurityPage({ page }: { page: PageRecord }) {
  const locale: Locale = page.locale === "en" ? "en" : "es";
  const content = getPageContent("cybersecurity", locale);
  if (!content) return null;

  const heroImage = content.hero.assetId ? getAsset(content.hero.assetId) : null;
  const heroCta = resolveAction(content.hero.cta, locale);

  // Filter out outcome grids (the 5 areas)
  const areas = content.blocks.filter((b) => b.type === "outcome_grid");
  const splitBlock = content.blocks.find((b) => b.type === "split_media");
  
  const finalCtaAction = content.cta?.action ? resolveAction(content.cta.action, locale) : null;

  return (
    <div className="cybersecurity-page">
      {/* Hero Section */}
      <section className="page-hero hero-with-visual" aria-labelledby="cyber-title">
        <div className="shell hero-layout">
          <div className="hero-content">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1 id="cyber-title">{content.hero.title}</h1>
            <p className="lead">{content.hero.intro}</p>
            {heroCta && (
              <div className="hero-actions">
                <Link className="button" href={heroCta.href}>{heroCta.label}</Link>
              </div>
            )}
          </div>
          {heroImage && (
            <div className="hero-visual" aria-hidden="true">
              <Image src={heroImage.path} alt="" fill priority sizes="(max-width: 900px) 100vw, 45vw" style={{ objectFit: "cover" }} />
            </div>
          )}
        </div>
      </section>

      {/* Main Layout with Sticky Navigation */}
      <section className="section detail-capabilities-section">
        <div className="shell">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Sticky Navigation Index */}
            <aside className="md:col-span-1">
              <nav className="anchored-index" aria-label={locale === "es" ? "Áreas de ciberseguridad" : "Cybersecurity areas"}>
                <p className="anchored-index-title">{locale === "es" ? "Áreas" : "Areas"}</p>
                <ul className="anchored-index-list">
                  {areas.map((block) => (
                    <li key={block.id}>
                      <a href={`#area-${block.id}`}>{block.eyebrow}</a>
                    </li>
                  ))}
                  {splitBlock && (
                    <li>
                      <a href={`#area-${splitBlock.id}`}>{splitBlock.eyebrow}</a>
                    </li>
                  )}
                </ul>
              </nav>
            </aside>

            {/* Areas Content */}
            <div className="md:col-span-3">
              <div className="flex flex-col gap-16">
                {areas.map((block, bIndex) => {
                  const blockItems = (block.items ?? []) as unknown as CyberBlockItem[];

                  return (
                    <section id={`area-${block.id}`} className="cyber-area-section scroll-mt-24" key={block.id}>
                      <span className="cyber-area-num" aria-hidden="true">0{bIndex + 1}</span>
                      <div className="cyber-area-header mb-8">
                        <p className="eyebrow">{block.eyebrow}</p>
                        <h2 className="text-2xl font-bold mb-3">{block.title}</h2>
                        {block.intro && <p className="text-gray-600">{block.intro}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {blockItems.map((item, iIndex) => {
                          const itemAsset = item.assetId ? getAsset(String(item.assetId)) : null;

                          return (
                            <article className="curated-card p-6 flex flex-col justify-between" key={item.title || iIndex}>
                              <div>
                                <span className="cyber-cap-num font-mono text-sm block mb-2" aria-hidden="true">
                                  0{bIndex + 1}.0{iIndex + 1}
                                </span>
                                <h3 className="text-lg font-bold mb-3 text-gray-900">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.summary}</p>
                              </div>
                              {itemAsset && (
                                <div className="relative w-full h-32 mt-4 rounded overflow-hidden">
                                  <Image src={itemAsset.path} alt={item.title || ""} fill sizes="(max-width: 600px) 100vw, 30vw" style={{ objectFit: "cover" }} />
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}

                {/* Final split block details */}
                {splitBlock && (
                  <section id={`area-${splitBlock.id}`} className="cyber-area-section scroll-mt-24 border-t pt-12" key={splitBlock.id}>
                    <article className="curated-split-card grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {splitBlock.assetId && (
                        <div className="relative aspect-video rounded overflow-hidden">
                          <Image
                            src={getAsset(String(splitBlock.assetId))!.path}
                            alt={splitBlock.title ?? ""}
                            fill
                            sizes="(max-width: 900px) 100vw, 40vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <div>
                        <p className="eyebrow">{splitBlock.eyebrow}</p>
                        <h3 className="text-2xl font-bold mb-4">{splitBlock.title}</h3>
                        <p className="text-gray-600 mb-6">{splitBlock.intro}</p>
                        {splitBlock.action && (
                          <Link className="button" href={resolveAction(splitBlock.action, locale)!.href}>
                            {resolveAction(splitBlock.action, locale)!.label}
                          </Link>
                        )}
                      </div>
                    </article>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

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
