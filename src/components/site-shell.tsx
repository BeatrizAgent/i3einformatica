import Link from "next/link";
import Image from "next/image";
import { getEquivalent, locales, pageHref, type PageRecord } from "@/lib/content/repository";
import { ReopenCookies } from "@/components/reopen-cookies";

const nav = {
  es: {
    services: [["Microsoft 365", "/microsoft-365"], ["Ciberseguridad", "/ciberseguridad"], ["Microsoft Azure", "/microsoft-azure"], ["Infraestructuras IT", "/infraestructuras-it"], ["Compliance y certificaciones", "/compliance-y-certificaciones"]],
    direct: [["Casos de éxito", "/casos-de-exito"], ["Sobre nosotros", "/sobre-nosotros"], ["Contacto", "/contacto"]],
    jobs: ["Únete al equipo", "/unete-al-equipo"],
  },
  en: {
    services: [["Microsoft 365", "/en/microsoft-365"], ["Cybersecurity", "/en/cybersecurity"], ["Microsoft Azure", "/en/microsoft-azure"], ["IT Infrastructure", "/en/it-infrastructure"], ["Compliance and certifications", "/en/compliance-and-certifications"]],
    direct: [["Success stories", "/en/success-stories"], ["About us", "/en/about-us"], ["Contact", "/en/contact"]],
    jobs: ["Join the team", "/en/join-the-team"],
  },
} as const;

function Navigation({ locale, mobile = false }: { locale: "es" | "en"; mobile?: boolean }) {
  const copy = nav[locale];
  return <nav aria-label={mobile ? (locale === "es" ? "Navegación móvil" : "Mobile navigation") : (locale === "es" ? "Navegación principal" : "Main navigation")}>
    <details className="services-menu">
      <summary>{locale === "es" ? "Servicios" : "Services"}</summary>
      <div className="services-menu-panel">{copy.services.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
    </details>
    {copy.direct.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
    <Link href={copy.jobs[1]}>{copy.jobs[0]}</Link>
  </nav>;
}

export function Logo({ priority = false }: { priority?: boolean } = {}) {
  return <span className="logo" aria-label="i3e Informática"><Image src="/assets/i3e/logo-i3e-25.webp" alt="i3e Informática" width={128} height={84} priority={priority} /></span>;
}

export function SiteHeader({ page }: { page: PageRecord }) {
  const shellLocale = page.locale === "en" ? "en" : "es";
  const es = getEquivalent(page.id, "es");
  const en = getEquivalent(page.id, "en");
  const available = { ...(es ? { es: pageHref(es) } : {}), ...(en ? { en: pageHref(en) } : {}), ...page.availableLocales };
  return <header className="site-header">
    <a href="#content" className="skip-link">{shellLocale === "es" ? "Saltar al contenido principal" : "Skip to main content"}</a>
    <div className="shell header-inner">
      <Link href={page.locale === "es" ? "/" : `/${page.locale}`} className="brand"><Logo priority /></Link>
      <div className="desktop-navigation"><Navigation locale={shellLocale} /></div>
      <details className="mobile-menu"><summary>{shellLocale === "es" ? "Menú" : "Menu"}</summary><Navigation locale={shellLocale} mobile /></details>
      <div className="header-actions">
        <details className="language-switcher">
          <summary aria-label={shellLocale === "es" ? "Cambiar idioma" : "Change language"}>{page.locale.toUpperCase()}</summary>
          <div>{locales.map((locale) => available[locale] ? <Link key={locale} href={available[locale]!} lang={locale} aria-current={locale === page.locale ? "page" : undefined}>{locale.toUpperCase()}</Link> : <span key={locale} aria-disabled="true" title="Traducción en revisión">{locale.toUpperCase()}</span>)}</div>
        </details>
        <Link className="button button-small" href={page.locale === "en" ? "/en/contact" : "/contacto"}>{shellLocale === "es" ? "Contactar" : "Contact"}</Link>
      </div>
    </div>
  </header>;
}

const certifications = [
  { name: "ISO 9001", src: "/assets/i3e/iso_9001.webp", width: 460, height: 601 },
  { name: "ISO 20000-1", src: "/assets/i3e/iso_20000.webp", width: 464, height: 595 },
  { name: "ISO 14001", src: "/assets/i3e/iso_14001.webp", width: 460, height: 602 },
  { name: "ISO 27001", src: "/assets/i3e/iso_27001.webp", width: 461, height: 648 },
];

export function SiteFooter({ locale }: Pick<PageRecord, "locale">) {
  const es = locale !== "en";
  return <footer className="site-footer">
    <div className="shell footer-grid">
      <div><Logo /><p>{es ? "Tecnología útil. Relaciones duraderas." : "Useful technology. Lasting relationships."}</p></div>
      <div><strong>{es ? "Explora" : "Explore"}</strong><Link href={es ? "/microsoft-365/soluciones" : "/en/microsoft-365/microsoft-365-solutions"}>{es ? "Soluciones" : "Solutions"}</Link><Link href={es ? "/casos-de-exito" : "/en/success-stories"}>{es ? "Casos de éxito" : "Success stories"}</Link><Link href={es ? "/sobre-nosotros" : "/en/about-us"}>{es ? "Sobre nosotros" : "About us"}</Link><Link href={es ? "/unete-al-equipo" : "/en/join-the-team"}>{es ? "Únete al equipo" : "Join the team"}</Link></div>
      <div><strong>Legal</strong><Link href={es ? "/politica-de-privacidad" : "/en/privacy-policy"}>{es ? "Privacidad" : "Privacy"}</Link><Link href={es ? "/politica-de-cookies" : "/en/cookie-policy"}>Cookies</Link><Link href={es ? "/aviso-legal" : "/en/legal-notice"}>{es ? "Aviso legal" : "Legal notice"}</Link><Link href={es ? "/denuncias" : "/en/complaints"}>{es ? "Canal de denuncias" : "Whistleblowing"}</Link><ReopenCookies label={es ? "Preferencias de cookies" : "Cookie preferences"} /></div>
      <div><strong>{es ? "Contacto" : "Contact"}</strong><a href="tel:+34900923330">900 923 330</a><a href="mailto:info@i3einformatica.com">info@i3einformatica.com</a></div>
    </div>
    <div className="shell footer-certifications-row"><div className="footer-certifications">{certifications.map((cert) => <Image key={cert.name} src={cert.src} alt={cert.name} width={cert.width} height={cert.height} sizes="100px" className="footer-cert-img" />)}</div></div>
    <div className="shell footer-bottom">{new Date().getFullYear()} i3e Informática</div>
  </footer>;
}
