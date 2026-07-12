import Image from "next/image";

import { CuratedPageBlocks } from "@/components/landing/curated-page-blocks";
import { HeroScene } from "@/components/landing/hero-scene";
import { M365Hub } from "@/components/landing/m365-hub";
import { PageHero } from "@/components/landing/page-hero";
import { ServicesShowcase } from "@/components/landing/services-showcase";
import { ApproachBand } from "@/components/landing/approach-band";
import { AzurePage } from "@/components/landing/azure-page";
import { CasesGrid } from "@/components/landing/cases-grid";
import { ClientStrip } from "@/components/landing/client-strip";
import { ExperienceBand } from "@/components/landing/experience-band";
import { PartnerMarquee } from "@/components/landing/partner-marquee";
import { StatsStrip } from "@/components/landing/stats-strip";
import { MotionRevealItem, MotionStagger, ScrollReveal } from "@/components/landing/scroll-reveal";
import { landingServices } from "@/components/landing/services-data";
import type { PageRecord } from "@/lib/content/repository";
import { landingSolutions } from "@/lib/site-assets";
import { getAsset, getPageContent, getPageDocument, resolveAction, type ContentLocale } from "@/lib/page-content";
import { templateCopy } from "@/lib/page-template-data";
import { M365DetailPage } from "@/components/landing/m365-detail-page";
import { CybersecurityPage } from "@/components/landing/cybersecurity-page";
import { InfraPage } from "@/components/landing/infra-page";

function localeFor(page: PageRecord): ContentLocale {
  return page.locale === "en" ? "en" : "es";
}

function textFor(value: { es: string; en: string }, locale: ContentLocale) {
  return value[locale];
}

function curatedVisual(page: PageRecord, assetId?: string) {
  if (!assetId) return undefined;
  const asset = getAsset(assetId);
  const document = getPageDocument(page.id);
  const ref = document?.assets.find((candidate) => candidate.assetId === assetId);
  return asset ? { src: asset.path, alt: ref?.alt ?? assetId } : undefined;
}

function CuratedTemplate({ page }: { page: PageRecord }) {
  const locale = localeFor(page);
  const content = getPageContent(page.id, locale);
  if (!content) return <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} cta={page.cta} />;
  const action = resolveAction(content.hero.cta, locale) ?? page.cta;
  return <>
    <PageHero eyebrow={content.hero.eyebrow} title={content.hero.title} intro={content.hero.intro} visual={curatedVisual(page, content.hero.assetId)} cta={action} />
    <CuratedPageBlocks page={page} locale={locale} content={content} />
  </>;
}

function HomeTemplate({ page }: { page: PageRecord }) {
  const locale = localeFor(page);
  const copy = templateCopy.home;
  const secondaryCta = locale === "es" ? { href: "/microsoft-365/soluciones", label: "Ver soluciones" } : { href: "/en/microsoft-365/microsoft-365-solutions", label: "View solutions" };
  return <>
    <HeroScene eyebrow={page.eyebrow} title={page.title} intro={page.intro} locale={locale} cta={page.cta} secondaryCta={secondaryCta} />
    <StatsStrip locale={locale} />
    <PartnerMarquee locale={locale} />
    <section className="home-approach section" aria-labelledby="capabilities-title"><div className="shell"><ScrollReveal className="home-approach-intro" enabled><div><p className="eyebrow">{textFor(copy.audienceEyebrow, locale)}</p><h2 id="capabilities-title">{textFor(copy.audienceTitle, locale)}</h2></div><p>{textFor(copy.audienceText, locale)}</p></ScrollReveal><MotionStagger className="home-audience-grid" enabled>{landingSolutions.slice(0, 2).map((item) => <MotionRevealItem as="article" className="home-audience-card" key={item.src} enabled><div className="home-audience-media"><Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 50vw" /></div><div><h3>{item.title[locale]}</h3><p>{item.text[locale]}</p></div></MotionRevealItem>)}</MotionStagger></div></section>
    <ApproachBand locale={locale} enabled={false} />
    <ServicesShowcase items={landingServices} locale={page.locale} />
    <ExperienceBand locale={page.locale} />
    <ClientStrip locale={page.locale} />
    <CasesGrid locale={locale} />
  </>;
}

function M365HubTemplate({ page }: { page: PageRecord }) {
  return <M365Hub locale={localeFor(page)} enabled={true} />;
}

function CasesTemplate({ page }: { page: PageRecord }) {
  return <CuratedTemplate page={page} />;
}

export function PublicPageTemplate({ page }: { page: PageRecord }) {
  if (page.id === "home") return <HomeTemplate page={page} />;
  if (page.id === "microsoft-azure" || page.id === "azure") return <AzurePage page={page} />;
  if (page.id === "microsoft-365" || page.id === "m365") return <M365HubTemplate page={page} />;
  if (page.id === "microsoft-365-products" || page.id === "microsoft-365-solutions") return <M365DetailPage page={page} />;
  if (page.id === "cybersecurity" || page.id === "cyber") return <CybersecurityPage page={page} />;
  if (page.id === "it-infrastructure" || page.id === "infra") return <InfraPage page={page} />;
  if (page.id === "success-stories" || page.id === "cases") return <CasesTemplate page={page} />;
  return <CuratedTemplate page={page} />;
}
