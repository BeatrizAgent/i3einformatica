import Image from "next/image";
import Link from "next/link";
import { MotionRevealItem, MotionStagger, ScrollReveal } from "@/components/landing/scroll-reveal";
import { getAsset, getPageContent, resolveAction } from "@/lib/page-content";
import { TechnologyBand } from "@/components/landing/technology-band";
import { BrandIcon, type BrandIconName } from "@/components/brand-icon";
import { assetPath } from "@/lib/public-path";

type Locale = "es" | "en";

interface CapabilityItem {
  title?: string;
  summary?: string;
}

export function M365Hub({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const content = getPageContent("microsoft-365", locale);
  if (!content) return null;

  const heroCta = resolveAction(content.hero.cta, locale);
  const heroImage = content.hero.assetId ? getAsset(content.hero.assetId) : null;
  const heroBg = heroImage ? heroImage.path : assetPath("/assets/i3e/edificios.webp");

  // Get the split_media block for Product & Solutions cards
  const splitBlock = content.blocks.find((b) => b.id === "product-solution");
  const productAction = splitBlock?.action ? resolveAction(splitBlock.action, locale) : null;
  const productHref = productAction?.href ?? (locale === "es" ? "/microsoft-365/producto" : "/en/microsoft-365/microsoft-365-products");
  const solutionsHref = locale === "es" ? "/microsoft-365/soluciones" : "/en/microsoft-365/microsoft-365-solutions";

  // Get the capabilities block
  const capabilitiesBlock = content.blocks.find((b) => b.id === "capabilities");
  const capabilityItems = (capabilitiesBlock?.items ?? []) as unknown as CapabilityItem[];

  const getCapabilityIcon = (itemKey: string): BrandIconName => {
    if (itemKey.includes("copilot")) return "copilot";
    if (itemKey.includes("sharepoint")) return "sharepoint";
    if (itemKey.includes("teams") || itemKey.includes("colabora")) return "teams";
    if (itemKey.includes("seguridad") || itemKey.includes("security")) return "security";
    return "microsoft";
  };

  const finalCtaAction = content.cta?.action ? resolveAction(content.cta.action, locale) : null;

  return (
    <div className="m365-hub-page">
      {/* Hero Section */}
      <section className="m365-hero" aria-labelledby="m365-title">
        <div className="m365-hero-background" aria-hidden="true">
          <Image src={heroBg} alt="" fill priority sizes="100vw" />
          <div className="m365-hero-overlay" />
        </div>
        <div className="shell m365-hero-content">
          <div className="m365-hero-icon"><BrandIcon name="microsoft365" size={112} /></div>
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1 id="m365-title">{content.hero.title}</h1>
          <p className="lead">{content.hero.intro}</p>
          {heroCta && (
            <div className="m365-hero-actions">
              <Link className="m365-button-primary" href={heroCta.href}>{heroCta.label}</Link>
              <Link className="m365-button-outline" href={productHref}>
                {locale === "es" ? "Ver productos" : "View products"}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Two Paths: Product & Solutions Cards */}
      <section className="m365-section-shell content-deferred-lg" aria-label={locale === "es" ? "Caminos de Microsoft 365" : "Microsoft 365 Paths"}>
        <div className="shell">
          <div className="m365-two-paths-grid">
            {/* Product Card */}
            <ScrollReveal className="m365-block-card" enabled={enabled}>
              <div className="m365-block-media">
                <Image
                  src={assetPath("/assets/i3e/migracion-min.webp")}
                  alt="Microsoft 365 Producto"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
              <div className="m365-block-copy">
                <h2>{locale === "es" ? "Producto" : "Product"}</h2>
                <p>
                  {locale === "es"
                    ? "Configuramos y gobernamos el entorno de Microsoft 365 adaptándolo a la gestión documental, automatizaciones y normativas de seguridad de tu organización."
                    : "We configure and govern the Microsoft 365 environment, tailoring it to your organization's document management, automations, and security regulations."}
                </p>
                <Link className="m365-link-arrow" href={productHref}>
                  {locale === "es" ? "Ver productos" : "View products"} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </ScrollReveal>

            {/* Solutions Card */}
            <ScrollReveal className="m365-block-card" enabled={enabled}>
              <div className="m365-block-media">
                <Image
                  src={assetPath("/assets/i3e/soluciones-1024x768.webp")}
                  alt="Microsoft 365 Soluciones"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
              <div className="m365-block-copy">
                <h2>{locale === "es" ? "Soluciones" : "Solutions"}</h2>
                <p>
                  {locale === "es"
                    ? "Acompañamos tu cambio digital con soporte y consultoría especializada: seguridad documental, control de accesos, planes de backup y adopción proactiva."
                    : "We support your digital change with specialized help and consulting: document security, access control, backup plans, and proactive adoption."}
                </p>
                <Link className="m365-link-arrow" href={solutionsHref}>
                  {locale === "es" ? "Ver soluciones" : "View solutions"} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Capabilities Section (4 Access points) */}
      {capabilitiesBlock && (
        <section className="m365-section-shell content-deferred-lg" aria-labelledby="capabilities-title">
          <div className="shell">
            <div className="m365-section-heading">
              {capabilitiesBlock.eyebrow && <p className="eyebrow">{capabilitiesBlock.eyebrow}</p>}
              <h2 id="capabilities-title">{capabilitiesBlock.title}</h2>
            </div>
            <MotionStagger className="m365-mini-grid-4" enabled={enabled}>
              {capabilityItems.map((item, index) => {
                const itemTitle = item.title || "";
                const itemSummary = item.summary || "";
                const itemKey = itemTitle.toLowerCase();
                const icon = getCapabilityIcon(itemKey);
                // Determine target link based on capability
                const href = (itemKey.includes("seguridad") || itemKey.includes("security") || itemKey.includes("colabora"))
                  ? solutionsHref
                  : productHref;

                return (
                  <MotionRevealItem as="article" className="m365-mini-card" key={itemTitle || index} enabled={enabled}>
                    <Link href={href} className="m365-mini-card-link">
                      <span className="m365-mini-card-icon"><BrandIcon name={icon} size={96} /></span>
                      <h4>{itemTitle}</h4>
                      <p className="m365-mini-card-desc">{itemSummary}</p>
                    </Link>
                  </MotionRevealItem>
                );
              })}
            </MotionStagger>
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
