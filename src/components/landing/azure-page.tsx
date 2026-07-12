import { assetPath } from "@/lib/public-path";
import Image from "next/image";
import Link from "next/link";

import type { PageRecord } from "@/lib/content/repository";

type AzureLocale = "es" | "en";

const sectionCopy = {
  es: {
    migrationTitle: "Infraestructura y migración a Azure",
    migrationText: "Facilitamos tu paso a Azure con una migración ordenada, clara y hecha a tu medida.",
    securityTitle: "Seguridad y cumplimiento en Microsoft Azure",
    securityText: "Protege tu infraestructura cloud con soluciones de seguridad avanzadas.",
    modernizationTitle: "Modernización y desarrollo en la nube",
    modernizationText: "Aprovecha las capacidades de desarrollo y automatización de Azure.",
    dataTitle: "Análisis de datos e inteligencia artificial",
    dataText: "Convierte los datos en información valiosa con Azure AI y Data Services.",
    managedTitle: "Administración y servicios gestionados en Azure",
    managedText: "Supervisamos y gestionamos tu entorno Azure para que funcione con estabilidad, control y sin interrupciones.",
    focus: ["Evaluación y migración", "Seguridad y cumplimiento", "Operación con control"],
    focusText: ["Planificamos dependencias y continuidad para que el cambio sea claro y ordenado.", "Protegemos tu infraestructura cloud con controles alineados con tus riesgos.", "Supervisamos el entorno para mantener estabilidad, visibilidad y costes previsibles."],
  },
  en: {
    migrationTitle: "Infrastructure and migration to Azure",
    migrationText: "We make your move to Azure orderly, clear and tailored to your needs.",
    securityTitle: "Security and compliance in Microsoft Azure",
    securityText: "Protect your cloud infrastructure with advanced security solutions.",
    modernizationTitle: "Modernization and cloud development",
    modernizationText: "Make the most of Azure development and automation capabilities.",
    dataTitle: "Data analytics and artificial intelligence",
    dataText: "Turn data into valuable information with Azure AI and Data Services.",
    managedTitle: "Azure administration and managed services",
    managedText: "We monitor and manage your Azure environment so it runs with stability, control and no interruptions.",
    focus: ["Assessment and migration", "Security and compliance", "Controlled operations"],
    focusText: ["We plan dependencies and continuity so the change is clear and orderly.", "We protect your cloud infrastructure with controls aligned to your risks.", "We monitor the environment to maintain stability, visibility and predictable costs."],
  },
} satisfies Record<AzureLocale, {
  migrationTitle: string; migrationText: string; securityTitle: string; securityText: string;
  modernizationTitle: string; modernizationText: string; dataTitle: string; dataText: string;
  managedTitle: string; managedText: string; focus: string[]; focusText: string[];
}>;

const copy = {
  es: {
    eyebrow: "Microsoft Azure",
    title: "Microsoft Azure",
    intro: "Transformamos tu infraestructura en un entorno Azure flexible, bien gestionado y conectado con las necesidades reales de tu negocio o institución.",
    primaryAction: "Solicitar información",
    secondaryAction: "Más información",
    capabilityEyebrow: "Capacidades Azure",
    capabilityTitle: "Una nube preparada para lo que viene",
    capabilityIntro: "Desde la migración hasta la operación diaria, construimos un entorno cloud que aporta claridad, seguridad y margen para crecer.",
    operatingEyebrow: "Operación gestionada",
    operatingTitle: "Azure funciona mejor cuando alguien se ocupa de todo el recorrido",
    operatingText: "Supervisamos y gestionamos tu entorno Azure para que funcione con estabilidad, control y sin interrupciones.",
    operatingAction: "Hablar con un especialista",
    ctaEyebrow: "Siguiente paso",
    ctaTitle: "Convierte Azure en una ventaja operativa",
    ctaText: "Revisamos tu punto de partida y definimos una evolución cloud viable.",
    ctaAction: "Contactar",
    capabilities: [
      { title: "Infraestructura y migración a Azure", text: "Facilitamos tu paso a Azure con una migración ordenada, clara y hecha a tu medida.", image: assetPath("/assets/i3e/generated/i3e-azure-migration.webp"), alt: "Migración ordenada de infraestructura a Azure" },
      { title: "Seguridad y cumplimiento en Microsoft Azure", text: "Protege tu infraestructura cloud con soluciones de seguridad avanzadas.", image: assetPath("/assets/i3e/generated/i3e-azure-security.webp"), alt: "Seguridad y cumplimiento de un entorno Azure" },
      { title: "Modernización y desarrollo en la nube", text: "Aprovecha las capacidades de desarrollo y automatización de Azure.", image: assetPath("/assets/i3e/generated/i3e-azure-data-ai.webp"), alt: "Modernización y desarrollo sobre cloud" },
      { title: "Análisis de datos e inteligencia artificial", text: "Convierte los datos en información valiosa con Azure AI y Data Services.", image: assetPath("/assets/i3e/generated/i3e-azure-data-ai.webp"), alt: "Análisis de datos e inteligencia artificial en Azure" },
      { title: "Administración y servicios gestionados en Azure", text: "Supervisamos y gestionamos tu entorno Azure para que funcione con estabilidad, control y sin interrupciones.", image: assetPath("/assets/i3e/azure-infra-min.webp"), alt: "Administración de servicios gestionados en Azure" },
    ],
  },
  en: {
    eyebrow: "Microsoft Azure",
    title: "Microsoft Azure",
    intro: "We transform your infrastructure into a flexible, well-managed Azure environment connected to the real needs of your business or institution.",
    primaryAction: "Request information",
    secondaryAction: "Learn more",
    capabilityEyebrow: "Azure capabilities",
    capabilityTitle: "A cloud prepared for what comes next",
    capabilityIntro: "From migration to day-to-day operations, we build a cloud environment that brings clarity, security and room to grow.",
    operatingEyebrow: "Managed operations",
    operatingTitle: "Azure works better when someone owns the whole journey",
    operatingText: "We monitor and manage your Azure environment so it runs with stability, control and no interruptions.",
    operatingAction: "Talk to a specialist",
    ctaEyebrow: "Next step",
    ctaTitle: "Turn Azure into an operational advantage",
    ctaText: "We review your starting point and define a viable cloud evolution.",
    ctaAction: "Contact us",
    capabilities: [
      { title: "Infrastructure and migration to Azure", text: "We make your move to Azure orderly, clear and tailored to your needs.", image: assetPath("/assets/i3e/generated/i3e-azure-migration.webp"), alt: "Orderly infrastructure migration to Azure" },
      { title: "Security and compliance in Microsoft Azure", text: "Protect your cloud infrastructure with advanced security solutions.", image: assetPath("/assets/i3e/generated/i3e-azure-security.webp"), alt: "Security and compliance for an Azure environment" },
      { title: "Modernization and cloud development", text: "Make the most of Azure development and automation capabilities.", image: assetPath("/assets/i3e/generated/i3e-azure-data-ai.webp"), alt: "Modernization and development in the cloud" },
      { title: "Data analytics and artificial intelligence", text: "Turn data into valuable information with Azure AI and Data Services.", image: assetPath("/assets/i3e/generated/i3e-azure-data-ai.webp"), alt: "Data analytics and artificial intelligence in Azure" },
      { title: "Azure administration and managed services", text: "We monitor and manage your Azure environment so it runs with stability, control and no interruptions.", image: assetPath("/assets/i3e/azure-infra-min.webp"), alt: "Administration of managed Azure services" },
    ],
  },
} satisfies Record<AzureLocale, {
  eyebrow: string; title: string; intro: string; primaryAction: string; secondaryAction: string;
  capabilityEyebrow: string; capabilityTitle: string; capabilityIntro: string;
  operatingEyebrow: string; operatingTitle: string; operatingText: string; operatingAction: string;
  ctaEyebrow: string; ctaTitle: string; ctaText: string; ctaAction: string;
  capabilities: Array<{ title: string; text: string; image: string; alt: string }>;
}>;

export function AzurePage({ page }: { page: PageRecord }) {
  const locale: AzureLocale = page.locale === "en" ? "en" : "es";
  const content = copy[locale];
  const sections = sectionCopy[locale];
  const contactHref = locale === "en" ? "/en/contact" : "/contacto";
  const migration = content.capabilities[0];
  const security = content.capabilities[1];

  return (
    <div className="azure-page">
      <section className="azure-hero" aria-labelledby="azure-title">
        <div className="azure-hero-media" aria-hidden="true"><Image src={assetPath("/assets/i3e/generated/i3e-azure-hero.webp")} alt="" fill priority sizes="100vw" /></div>
        <div className="azure-hero-shade" aria-hidden="true" />
        <div className="shell azure-hero-inner">
          <Image className="azure-hero-mark" src={assetPath("/assets/i3e/arcticons-microsoft-azure-2.svg")} alt="" width={42} height={42} priority />
          <div className="azure-hero-copy">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 id="azure-title">{content.title}</h1>
            <p className="lead">{content.intro}</p>
            <div className="hero-actions">
              <Link className="button" href={contactHref}>{content.primaryAction}</Link>
              <a className="text-link azure-hero-link" href="#mas-info">{content.secondaryAction}<span aria-hidden="true"> ↓</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="section azure-migration" id="mas-info" aria-labelledby="azure-migration-title">
        <div className="shell">
          <div className="azure-section-heading azure-section-heading-centered">
            <p className="eyebrow">{content.capabilityEyebrow}</p>
            <h2 id="azure-migration-title">{sections.migrationTitle}</h2>
            <p>{sections.migrationText}</p>
          </div>
          <div className="azure-feature-layout">
            <div className="azure-feature-media"><Image src={migration.image} alt={migration.alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
            <div className="azure-focus-stack">
              {sections.focus.map((title, index) => <article className="azure-focus-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{sections.focusText[index]}</p></article>)}
            </div>
          </div>
          <div className="azure-mini-grid">
            <article className="azure-mini-card"><h3>{sections.securityTitle}</h3><p>{sections.securityText}</p></article>
            <article className="azure-mini-card"><h3>{sections.modernizationTitle}</h3><p>{sections.modernizationText}</p></article>
            <article className="azure-mini-card"><h3>{sections.dataTitle}</h3><p>{sections.dataText}</p></article>
            <article className="azure-mini-card"><h3>{sections.managedTitle}</h3><p>{sections.managedText}</p></article>
          </div>
        </div>
      </section>

      <section className="section azure-security" aria-labelledby="azure-security-title">
        <div className="shell">
          <div className="azure-section-heading azure-section-heading-centered">
            <p className="eyebrow">{content.capabilityEyebrow}</p>
            <h2 id="azure-security-title">{sections.securityTitle}</h2>
            <p>{sections.securityText}</p>
          </div>
          <div className="azure-security-layout">
            <div className="azure-security-stack">
              <article className="azure-focus-card"><span>01</span><h3>{sections.securityTitle}</h3><p>{security.text}</p></article>
              <article className="azure-focus-card"><span>02</span><h3>{locale === "es" ? "Cumplimiento y gobierno" : "Compliance and governance"}</h3><p>{locale === "es" ? "Alineamos controles, identidades y políticas para mantener visibilidad." : "We align controls, identities and policies to maintain visibility."}</p></article>
              <article className="azure-focus-card"><span>03</span><h3>{content.operatingEyebrow}</h3><p>{content.operatingText}</p></article>
            </div>
            <div className="azure-security-media"><Image src={security.image} alt={security.alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
          </div>
        </div>
      </section>

      <section className="section azure-modernization" aria-labelledby="azure-modernization-title">
        <div className="shell">
          <div className="azure-section-heading azure-section-heading-centered">
            <p className="eyebrow">{content.capabilityEyebrow}</p>
            <h2 id="azure-modernization-title">{sections.modernizationTitle}</h2>
            <p>{sections.modernizationText}</p>
          </div>
          <div className="azure-modernization-grid">
            <article className="azure-mini-card"><h3>{sections.modernizationTitle}</h3><p>{sections.modernizationText}</p></article>
            <article className="azure-mini-card"><h3>{sections.dataTitle}</h3><p>{sections.dataText}</p></article>
            <article className="azure-mini-card"><h3>{sections.managedTitle}</h3><p>{sections.managedText}</p></article>
          </div>
        </div>
      </section>

      <section className="cta azure-cta">
        <div className="shell cta-inner"><div><p className="eyebrow">{content.ctaEyebrow}</p><h2>{content.ctaTitle}</h2><p>{content.ctaText}</p></div><Link className="button button-light" href={contactHref}>{content.ctaAction}</Link></div>
      </section>
    </div>
  );
}
