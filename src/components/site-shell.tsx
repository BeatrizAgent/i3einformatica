import Link from "next/link";
import Image from "next/image";
import { getEquivalent, locales, pageHref, type PageRecord } from "@/lib/content/repository";

const nav = {
  es: [["Microsoft 365", "/microsoft-365"], ["Ciberseguridad", "/ciberseguridad"], ["Microsoft Azure", "/microsoft-azure"], ["Infraestructuras IT", "/infraestructuras-it"], ["Sobre nosotros", "/sobre-nosotros"]],
  en: [["Microsoft 365", "/en/microsoft-365"], ["Cybersecurity", "/en/cybersecurity"], ["Microsoft Azure", "/en/microsoft-azure"], ["IT Infrastructure", "/en/it-infrastructure"], ["About us", "/en/about-us"]],
} as const;

export function Logo({ priority = false }: { priority?: boolean } = {}) {
  return <span className="logo" aria-label="i3e Informática"><Image src="/assets/i3e/logo-i3e-25.webp" alt="i3e Informática" width={128} height={84} priority={priority} /></span>;
}

export function SiteHeader({ page }: { page: PageRecord }) {
  const shellLocale = page.locale === "en" ? "en" : "es";
  const es = getEquivalent(page.id, "es");
  const en = getEquivalent(page.id, "en");
  const available = { ...(es ? { es: pageHref(es) } : {}), ...(en ? { en: pageHref(en) } : {}), ...page.availableLocales };
  return (
    <header className="site-header">
      <a href="#content" className="skip-link">{shellLocale === "es" ? "Saltar al contenido principal" : "Skip to main content"}</a>
      <div className="shell header-inner">
        <Link href={page.locale === "es" ? "/" : `/${page.locale}`} className="brand"><Logo priority /></Link>
        <nav aria-label={shellLocale === "es" ? "Navegación principal" : "Main navigation"}>
          {nav[shellLocale].map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <details className="mobile-menu"><summary>{shellLocale === "es" ? "Menú" : "Menu"}</summary><nav aria-label={shellLocale === "es" ? "Navegación móvil" : "Mobile navigation"}>{nav[shellLocale].map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></details>
        <div className="header-actions">
          <details className="language-switcher">
            <summary aria-label={shellLocale === "es" ? "Cambiar idioma" : "Change language"}>{page.locale.toUpperCase()}</summary>
            <div>{locales.map((locale) => available[locale] ? <Link key={locale} href={available[locale]!} lang={locale} aria-current={locale === page.locale ? "page" : undefined}>{locale.toUpperCase()}</Link> : <span key={locale} aria-disabled="true" title="Traducción en revisión">{locale.toUpperCase()}</span>)}</div>
          </details>
          <Link className="button button-small" href={page.locale === "en" ? "/en/contact" : "/contacto"}>{shellLocale === "es" ? "Contactar" : "Contact"}</Link>
        </div>
      </div>
    </header>
  );
}

const certifications = [
  { name: "ISO 9001", src: "/assets/i3e/iso_9001.webp", width: 460, height: 601 },
  { name: "ISO 20000-1", src: "/assets/i3e/iso_20000.webp", width: 464, height: 595 },
  { name: "ISO 14001", src: "/assets/i3e/iso_14001.webp", width: 460, height: 602 },
  { name: "ISO 27001", src: "/assets/i3e/iso_27001.webp", width: 461, height: 648 },
];

import { ReopenCookies } from "@/components/reopen-cookies";

export function SiteFooter({ locale }: Pick<PageRecord, "locale">) {
  const es = locale !== "en";
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div><Logo /><p>{es ? "Tecnología útil. Relaciones duraderas." : "Useful technology. Lasting relationships."}</p></div>
        <div><strong>{es ? "Explora" : "Explore"}</strong><Link href={es ? "/microsoft-365/soluciones" : "/en/microsoft-365/microsoft-365-solutions"}>{es ? "Soluciones" : "Solutions"}</Link><Link href={es ? "/casos-de-exito" : "/en/success-stories"}>{es ? "Casos de éxito" : "Success stories"}</Link></div>
        <div><strong>Legal</strong><Link href={es ? "/politica-de-privacidad" : "/en/privacy-policy"}>{es ? "Privacidad" : "Privacy"}</Link><Link href={es ? "/denuncias" : "/en/complaints"}>{es ? "Canal de denuncias" : "Whistleblowing"}</Link><ReopenCookies label={es ? "Preferencias de cookies" : "Cookie preferences"} /></div>
        <div><strong>{es ? "Contacto" : "Contact"}</strong><a href="tel:+34900923330">900 923 330</a><a href="mailto:info@i3einformatica.com">info@i3einformatica.com</a></div>
      </div>
      <div className="shell footer-certifications-row">
        <div className="footer-certifications">
          {certifications.map((cert) => (
            <Image
              key={cert.name}
              src={cert.src}
              alt={cert.name}
              width={cert.width}
              height={cert.height}
              sizes="100px"
              className="footer-cert-img"
            />
          ))}
        </div>
      </div>
      <div className="shell footer-bottom">
        {new Date().getFullYear()} i3e Informática
      </div>
    </footer>
  );
}
