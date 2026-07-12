import { assetPath } from "@/lib/public-path";
import Image from "next/image";
import Link from "next/link";
import { MotionRevealItem, MotionStagger, ScrollReveal } from "@/components/landing/scroll-reveal";
import type { LocalizedText, TemplateCard } from "@/lib/page-template-data";

type Locale = "es" | "en";

const m365HubProductCards: { card: TemplateCard; icon: string }[] = [
  { card: { src: assetPath("/assets/i3e/migracion-min.webp"), alt: "Microsoft 365", title: { es: "Microsoft 365", en: "Microsoft 365" }, href: { es: "/microsoft-365/producto", en: "/en/microsoft-365/microsoft-365-products" } }, icon: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg") },
  { card: { src: assetPath("/assets/i3e/copilot-min.webp"), alt: "Microsoft Copilot", title: { es: "Copilot", en: "Copilot" }, href: { es: "/microsoft-365/producto", en: "/en/microsoft-365/microsoft-365-products" } }, icon: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg") },
  { card: { src: assetPath("/assets/i3e/migracion-sharepoint-min.webp"), alt: "Microsoft SharePoint", title: { es: "SharePoint", en: "SharePoint" }, href: { es: "/microsoft-365/producto", en: "/en/microsoft-365/microsoft-365-products" } }, icon: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg") },
  { card: { src: assetPath("/assets/i3e/soluciones-1024x768.webp"), alt: "Teams y colaboración", title: { es: "Teams y colaboración", en: "Teams and collaboration" }, href: { es: "/microsoft-365/soluciones", en: "/en/microsoft-365/microsoft-365-solutions" } }, icon: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg") },
];

const m365HubSolutionCards: { card: TemplateCard; icon: string }[] = [
  { card: { src: assetPath("/assets/i3e/proteccion-2-min.webp"), alt: "Seguridad y cumplimiento Microsoft 365", title: { es: "Seguridad y cumplimiento Microsoft 365", en: "Microsoft 365 security and compliance" }, href: { es: "/microsoft-365/soluciones", en: "/en/microsoft-365/microsoft-365-solutions" } }, icon: assetPath("/assets/i3e/arcticons-security-2.svg") },
  { card: { src: assetPath("/assets/i3e/analisis-min.webp"), alt: "Consultoría y Asesoría Microsoft 365", title: { es: "Consultoría y Asesoría Microsoft 365", en: "Microsoft 365 consulting and advisory" }, href: { es: "/microsoft-365/soluciones", en: "/en/microsoft-365/microsoft-365-solutions" } }, icon: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg") },
  { card: { src: assetPath("/assets/i3e/servicios-gestionados-min.webp"), alt: "Backup y recuperación Microsoft 365", title: { es: "Backup y recuperación Microsoft 365", en: "Microsoft 365 backup and recovery" }, href: { es: "/microsoft-365/soluciones", en: "/en/microsoft-365/microsoft-365-solutions" } }, icon: assetPath("/assets/i3e/arcticons-serverbox-2.svg") },
];

const productCopy = {
  es: "Microsoft 365 es una plataforma cloud que permite a los equipos trabajar de forma coordinada, segura y eficiente desde cualquier lugar. Gestionamos cada entorno para responder a la gobernanza, seguridad documental y automatización de cada organización.",
  en: "Microsoft 365 is a cloud platform that enables teams to work in a coordinated, secure and efficient way from anywhere. We manage each environment to match the governance, document security and automation of every organization.",
};

const solutionsCopy = {
  es: "Configuramos, acompañamos y gestionamos tu entorno Microsoft 365 desde el inicio: permisos, seguridad y administración clara para que el equipo colabore sin fricciones, mantenga el control y escale sin fricciones.",
  en: "We configure, support and manage your Microsoft 365 environment from the start: permissions, security and clear administration so the team can collaborate without friction, keep control and scale without friction.",
};

const implementCopy = {
  title: { es: "Implementa Microsoft 365 de manera profesional", en: "Implement Microsoft 365 professionally" },
  text: { es: "Te ayudamos a implementar y mejorar tu entorno Microsoft 365, adaptándolo por completo a la forma de trabajar de tu organización.", en: "We help you implement and improve your Microsoft 365 environment, fully adapted to the way your organization works." },
  cta: { es: "Pedir más información", en: "Request more information" },
};

const heroCopy = {
  title: { es: "Microsoft 365", en: "Microsoft 365" },
  text: { es: "Implantamos y gestionamos soluciones Microsoft 365 que mejoran la colaboración, protegen los datos y optimizan la productividad desde una perspectiva técnica y estructurada.", en: "We deploy and manage Microsoft 365 solutions that improve collaboration, protect data and optimize productivity from a technical and structured perspective." },
  primary: { es: "Iniciar la prueba", en: "Start the trial" },
  secondary: { es: "Ver información", en: "View information" },
};

const footerCopy = {
  brand: { es: "Somos una compañía especialista en soluciones tecnológicas para contar con 25 años de experiencia en el sector IT.", en: "We are a technology solutions company with 25 years of experience in the IT sector." },
  explore: { es: "Explora", en: "Explore" },
  exploreLinks: {
    es: [
      { label: "Inicio", href: "/" },
      { label: "Microsoft", href: "/microsoft-365" },
      { label: "Casos de éxito", href: "/casos-de-exito" },
      { label: "Sobre nosotros", href: "/sobre-nosotros" },
      { label: "Sobre el equipo", href: "/sobre-nosotros" },
      { label: "Eventos", href: "/sobre-nosotros" },
    ],
    en: [
      { label: "Home", href: "/en" },
      { label: "Microsoft", href: "/en/microsoft-365" },
      { label: "Success stories", href: "/en/success-stories" },
      { label: "About us", href: "/en/about-us" },
      { label: "About the team", href: "/en/about-us" },
      { label: "Events", href: "/en/about-us" },
    ],
  },
  services: { es: "Servicios", en: "Services" },
  servicesLinks: {
    es: [
      { label: "Microsoft 365", href: "/microsoft-365" },
      { label: "Microsoft 365 Productos", href: "/microsoft-365/producto" },
      { label: "Microsoft Azure", href: "/microsoft-azure" },
      { label: "Infraestructuras IT", href: "/infraestructuras-it" },
      { label: "Compliance y certificaciones", href: "/compliance-y-certificaciones" },
    ],
    en: [
      { label: "Microsoft 365", href: "/en/microsoft-365" },
      { label: "Microsoft 365 Products", href: "/en/microsoft-365/microsoft-365-products" },
      { label: "Microsoft Azure", href: "/en/microsoft-azure" },
      { label: "IT Infrastructure", href: "/en/it-infrastructure" },
      { label: "Compliance and certifications", href: "/en/compliance-and-certifications" },
    ],
  },
  contact: { es: "Contacto", en: "Contact" },
  contactInfo: {
    es: { address: "C/ Crom 35-37, 5º - 08907 - L'Hospitalet de Llobregat, España", phone: "(+34) 900 923 330", email: "info@i3einformatica.com" },
    en: { address: "C/ Crom 35-37, 5th floor - 08907 - L'Hospitalet de Llobregat, Spain", phone: "(+34) 900 923 330", email: "info@i3einformatica.com" },
  },
  legalLinks: {
    es: [
      { label: "Política de privacidad", href: "/politica-de-privacidad" },
      { label: "Política de cookies", href: "/politica-de-cookies" },
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Canal denuncias", href: "/denuncias" },
    ],
    en: [
      { label: "Privacy policy", href: "/en/privacy-policy" },
      { label: "Cookie policy", href: "/en/cookie-policy" },
      { label: "Legal notice", href: "/en/legal-notice" },
      { label: "Whistleblowing channel", href: "/en/complaints" },
    ],
  },
  language: { es: "Español", en: "English" },
};

const socialIcons = {
  linkedin: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg"),
  youtube: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg"),
};

function t(value: LocalizedText, locale: Locale) {
  return value[locale];
}

function Microsoft365Icon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="12" y="12" width="10" height="10" fill="currentColor" />
      <rect x="26" y="12" width="10" height="10" fill="currentColor" />
      <rect x="12" y="26" width="10" height="10" fill="currentColor" />
      <rect x="26" y="26" width="10" height="10" fill="currentColor" />
    </svg>
  );
}

function ProductCard({ card, icon, locale, enabled }: { card: TemplateCard; icon: string; locale: Locale; enabled: boolean }) {
  return (
    <MotionRevealItem as="article" className="m365-mini-card" enabled={enabled}>
      <Link href={t(card.href!, locale)} className="m365-mini-card-link">
        <span className="m365-mini-card-icon"><Image src={icon} alt="" width={40} height={40} /></span>
        <h4>{t(card.title, locale)}</h4>
      </Link>
    </MotionRevealItem>
  );
}

function M365HubFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="m365-hub-footer">
      <div className="shell m365-hub-footer-top">
        <div className="m365-hub-footer-brand">
          <span className="logo" aria-label="i3e Informática">
            <Image src={assetPath("/assets/i3e/logo-i3e-25.webp")} alt="i3e Informática" width={128} height={84} />
          </span>
          <p>{footerCopy.brand[locale]}</p>
        </div>
        <div className="m365-hub-footer-cols">
          <div className="m365-hub-footer-col">
            <strong>{footerCopy.explore[locale]}</strong>
            {footerCopy.exploreLinks[locale].map((link) => (
              <Link key={link.label} href={link.href}>{link.label}</Link>
            ))}
          </div>
          <div className="m365-hub-footer-col">
            <strong>{footerCopy.services[locale]}</strong>
            {footerCopy.servicesLinks[locale].map((link) => (
              <Link key={link.label} href={link.href}>{link.label}</Link>
            ))}
          </div>
          <div className="m365-hub-footer-col">
            <strong>{footerCopy.contact[locale]}</strong>
            <address>
              <p>{footerCopy.contactInfo[locale].address}</p>
              <p><a href={`tel:${footerCopy.contactInfo[locale].phone.replace(/[^+\d]/g, "")}`}>{footerCopy.contactInfo[locale].phone}</a></p>
              <p><a href={`mailto:${footerCopy.contactInfo[locale].email}`}>{footerCopy.contactInfo[locale].email}</a></p>
            </address>
          </div>
        </div>
      </div>
      <div className="shell m365-hub-footer-bottom-bar">
        <nav className="m365-hub-footer-legal">
          {footerCopy.legalLinks[locale].map((link) => (
            <Link key={link.label} href={link.href}>{link.label}</Link>
          ))}
        </nav>
        <div className="m365-hub-footer-social">
          <a href="https://www.linkedin.com/company/i3e-informatica/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
            <Image src={socialIcons.linkedin} alt="" width={20} height={20} />
          </a>
          <a href="https://www.youtube.com/@i3einformatica" target="_blank" rel="noreferrer noopener" aria-label="YouTube">
            <Image src={socialIcons.youtube} alt="" width={20} height={20} />
          </a>
        </div>
        <div className="m365-hub-footer-language">
          <span>{footerCopy.language[locale]}</span>
        </div>
      </div>
      <div className="shell m365-hub-footer-certifications">
        <Image src={assetPath("/assets/i3e/iso_9001.webp")} alt="ISO 9001" width={56} height={74} />
        <Image src={assetPath("/assets/i3e/iso_20000.webp")} alt="ISO 20000-1" width={56} height={72} />
        <Image src={assetPath("/assets/i3e/certificaciones-iso.2.webp")} alt="Certificaciones ISO" width={180} height={62} />
      </div>
    </footer>
  );
}

export function M365Hub({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const productMedia = { src: assetPath("/assets/i3e/migracion-min.webp"), alt: "Microsoft 365 Producto" };
  const solutionsMedia = { src: assetPath("/assets/i3e/equipo-tecnico-1024x683.webp"), alt: "Soluciones Microsoft 365" };
  const implementMedia = { src: assetPath("/assets/i3e/edificios.webp"), alt: "Edificios corporativos" };

  return (
    <div className="m365-hub-page">
      <section className="m365-hero" aria-label="Microsoft 365">
        <div className="m365-hero-background" aria-hidden="true">
          <Image src={assetPath("/assets/i3e/edificios.webp")} alt="" fill priority sizes="100vw" />
          <div className="m365-hero-overlay" />
        </div>
        <div className="shell m365-hero-content">
          <div className="m365-hero-icon" aria-hidden="true"><Microsoft365Icon /></div>
          <h1>{t(heroCopy.title, locale)}</h1>
          <p className="lead">{t(heroCopy.text, locale)}</p>
          <div className="m365-hero-actions">
            <Link className="m365-button-primary" href={locale === "es" ? "/contacto" : "/en/contact"}>{t(heroCopy.primary, locale)}</Link>
            <Link className="m365-button-outline" href={locale === "es" ? "/microsoft-365/producto" : "/en/microsoft-365/microsoft-365-products"}>{t(heroCopy.secondary, locale)}</Link>
          </div>
        </div>
      </section>

      <section className="m365-section-shell content-deferred-lg">
        <div className="shell">
          <article className="m365-block-card">
            <div className="m365-block-media">
              <Image src={productMedia.src} alt={productMedia.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className="m365-block-copy">
              <h2>{locale === "es" ? "Producto" : "Product"}</h2>
              <p>{productCopy[locale]}</p>
              <Link className="m365-link-arrow" href={locale === "es" ? "/microsoft-365/producto" : "/en/microsoft-365/microsoft-365-products"}>
                {locale === "es" ? "Ver productos" : "View products"} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </article>

          <MotionStagger className="m365-mini-grid-4" enabled={enabled}>
            {m365HubProductCards.map((item) => (
              <ProductCard key={item.card.title.en} card={item.card} icon={item.icon} locale={locale} enabled={enabled} />
            ))}
          </MotionStagger>
        </div>
      </section>

      <section className="m365-section-shell content-deferred-lg">
        <div className="shell">
          <article className="m365-block-card m365-block-reverse">
            <div className="m365-block-media">
              <Image src={solutionsMedia.src} alt={solutionsMedia.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className="m365-block-copy">
              <h2>{locale === "es" ? "Soluciones" : "Solutions"}</h2>
              <p>{solutionsCopy[locale]}</p>
              <Link className="m365-link-arrow" href={locale === "es" ? "/microsoft-365/soluciones" : "/en/microsoft-365/microsoft-365-solutions"}>
                {locale === "es" ? "Ver soluciones" : "View solutions"} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </article>

          <MotionStagger className="m365-mini-grid-3" enabled={enabled}>
            {m365HubSolutionCards.map((item) => (
              <ProductCard key={item.card.title.en} card={item.card} icon={item.icon} locale={locale} enabled={enabled} />
            ))}
          </MotionStagger>
        </div>
      </section>

      <section className="m365-section-shell content-deferred-lg">
        <div className="shell">
          <ScrollReveal className="m365-horizontal-banner" enabled={enabled}>
            <div className="m365-horizontal-media">
              <Image src={implementMedia.src} alt={implementMedia.alt} fill sizes="(max-width: 900px) 100vw, 40vw" />
            </div>
            <div className="m365-horizontal-copy">
              <h3>{t(implementCopy.title, locale)}</h3>
              <p>{t(implementCopy.text, locale)}</p>
              <Link className="m365-button-primary" href={locale === "es" ? "/contacto" : "/en/contact"}>{t(implementCopy.cta, locale)}</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <M365HubFooter locale={locale} />
    </div>
  );
}
