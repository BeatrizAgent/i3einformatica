import Image from "next/image";
import Link from "next/link";
import { getAsset, getPageContent, resolveAction } from "@/lib/page-content";
import type { PageRecord } from "@/lib/content/repository";
import { TechnologyBand } from "@/components/landing/technology-band";

type AzureLocale = "es" | "en";

interface AzureBlockItem {
  title?: string;
  summary?: string;
  assetId?: string;
}

export function AzurePage({ page }: { page: PageRecord }) {
  const locale: AzureLocale = page.locale === "en" ? "en" : "es";
  const content = getPageContent("microsoft-azure", locale);
  if (!content) return null;

  const contactHref = locale === "en" ? "/en/contact" : "/contacto";
  const heroImage = content.hero.assetId ? getAsset(content.hero.assetId) : null;
  const heroBg = heroImage ? heroImage.path : "/assets/i3e/microsoft-azure-min.webp";
  const heroCta = resolveAction(content.hero.cta, locale);

  const capabilitiesBlock = content.blocks.find((b) => b.id === "capabilities");
  const processBlock = content.blocks.find((b) => b.id === "process");
  const finalCtaAction = content.cta?.action ? resolveAction(content.cta.action, locale) : null;

  const capItems = (capabilitiesBlock?.items ?? []) as unknown as AzureBlockItem[];
  const processItems = (processBlock?.items ?? []) as unknown as AzureBlockItem[];

  // Map cap index to their specific assets
  const capAssets = [
    "azure_migration",
    "azure_security",
    "service_azure", // fallback modernization
    "azure_analysis",
    "service_azure"
  ];

  return (
    <div className="azure-page">
      {/* Hero Section */}
      <section className="azure-hero" aria-labelledby="azure-title">
        <div className="azure-hero-media" aria-hidden="true">
          <Image src={heroBg} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="azure-hero-shade" aria-hidden="true" />
        <div className="shell azure-hero-inner">
          <Image className="azure-hero-mark" src="/assets/i3e/arcticons-microsoft-azure-2.svg" alt="" width={42} height={42} priority />
          <div className="azure-hero-copy">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1 id="azure-title">{content.hero.title}</h1>
            <p className="lead">{content.hero.intro}</p>
            {heroCta && (
              <div className="hero-actions">
                <Link className="button" href={heroCta.href}>{heroCta.label}</Link>
                <a className="text-link azure-hero-link" href="#mas-info">
                  {locale === "es" ? "Más información" : "Learn more"}<span aria-hidden="true"> ↓</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      {capabilitiesBlock && (
        <section className="section azure-migration" id="mas-info" aria-labelledby="capabilities-title">
          <div className="shell">
            <div className="azure-section-heading azure-section-heading-centered">
              <p className="eyebrow">{capabilitiesBlock.eyebrow}</p>
              <h2 id="capabilities-title">{capabilitiesBlock.title}</h2>
              {capabilitiesBlock.intro && <p>{capabilitiesBlock.intro}</p>}
            </div>

            {/* Alternating main capabilities layout */}
            <div className="azure-feature-layout mb-12">
              {capItems.slice(0, 2).map((item, index) => {
                const assetId = capAssets[index];
                const assetObj = getAsset(assetId);
                const imageSrc = assetObj ? assetObj.path : "/assets/i3e/infraestructura-migracion-min.webp";

                return (
                  <article className="azure-focus-card flex flex-col justify-between" key={item.title || index}>
                    <div className="relative aspect-video w-full rounded overflow-hidden mb-4">
                      <Image src={imageSrc} alt={item.title || ""} fill sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: "cover" }} />
                    </div>
                    <div>
                      <span>0{index + 1}</span>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Mini Grid for remaining capabilities */}
            {capItems.length > 2 && (
              <div className="azure-mini-grid">
                {capItems.slice(2).map((item, index) => (
                  <article className="azure-focus-card" key={item.title || index}>
                    <span>0{index + 3}</span>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4-Step Process Section */}
      {processBlock && (
        <section className="section azure-security" aria-labelledby="process-title">
          <div className="shell">
            <div className="azure-section-heading azure-section-heading-centered">
              <p className="eyebrow">{processBlock.eyebrow}</p>
              <h2 id="process-title">{processBlock.title}</h2>
              {processBlock.intro && <p>{processBlock.intro}</p>}
            </div>
            <div className="azure-modernization-grid">
              {processItems.map((item, index) => (
                <article className="azure-mini-card" key={item.title || index}>
                  <span className="font-mono text-sm block mb-2 text-sky-400">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technology Band */}
      <TechnologyBand locale={locale} />

      {/* Final CTA Section */}
      {content.cta && finalCtaAction && (
        <section className="cta azure-cta">
          <div className="shell cta-inner">
            <div>
              <p className="eyebrow">{content.cta.eyebrow}</p>
              <h2>{content.cta.title}</h2>
              <p>{content.cta.text}</p>
            </div>
            <Link className="button button-light" href={contactHref}>
              {finalCtaAction.label}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
