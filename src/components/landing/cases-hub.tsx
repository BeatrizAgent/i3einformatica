"use client";

import { assetPath } from "@/lib/public-path";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export type CaseStudyMeta = {
  label: { es: string; en: string };
  value: { es: string; en: string };
};

export type CaseStudy = {
  id: string;
  image: { src: string; alt: string };
  title: { es: string; en: string };
  description: { es: string; en: string };
  meta: CaseStudyMeta[];
};

type Locale = "es" | "en";

const cases: CaseStudy[] = [
  {
    id: "toyota-starbaix",
    image: { src: assetPath("/assets/i3e/toyota.webp"), alt: "Toyota Starbaix" },
    title: { es: "Toyota Starbaix", en: "Toyota Starbaix" },
    description: {
      es: "Soporte informático integral a importante cadena de Concesionarios. Se realiza el soporte y transformación de los sistemas para conseguir optimizar sus procesos y su movilidad. Se instala y gestiona MDM. Consiguiendo un 70% de reducción de las incidencias. Instalación y gestión de red LAN, monitorización de servidores, firewalls y soporte a usuarios.",
      en: "Comprehensive IT support for a major dealership chain. We deliver support and transform systems to optimise processes and mobility. We deploy and manage MDM, achieving a 70% reduction in incidents. LAN network installation and management, server monitoring, firewalls and end-user support.",
    },
    meta: [
      { label: { es: "Ámbito", en: "Scope" }, value: { es: "Automoción", en: "Automotive" } },
      { label: { es: "Sector", en: "Sector" }, value: { es: "Privado", en: "Private" } },
      { label: { es: "Servicio", en: "Service" }, value: { es: "Sistemas", en: "Systems" } },
      { label: { es: "Usuarios", en: "Users" }, value: { es: "+60", en: "+60" } },
      { label: { es: "Duración", en: "Duration" }, value: { es: "Desde 2015", en: "Since 2015" } },
    ],
  },
  {
    id: "gran-entidad-bancaria",
    image: { src: assetPath("/assets/i3e/entidad-bancaria.webp"), alt: "Gran entidad Bancaria" },
    title: { es: "Gran entidad Bancaria", en: "Major banking institution" },
    description: {
      es: "Despliegue de equipos nuevos, recogida de los equipos antiguos y destrucción de datos para entidad bancaria. Logística y gestión de parque incluido. Maquetación, entrega, explicación a usuario y despliegue 360.",
      en: "Deployment of new equipment, collection of legacy devices and certified data destruction for a banking institution. Logistics and fleet management included. Setup, delivery, end-user walkthrough and 360-degree rollout.",
    },
    meta: [
      { label: { es: "Ámbito", en: "Scope" }, value: { es: "Banca", en: "Banking" } },
      { label: { es: "Sector", en: "Sector" }, value: { es: "Privado", en: "Private" } },
      { label: { es: "Servicio", en: "Service" }, value: { es: "Despliegue", en: "Deployment" } },
      { label: { es: "Usuarios", en: "Users" }, value: { es: ">1000", en: ">1000" } },
      { label: { es: "Duración", en: "Duration" }, value: { es: "2023", en: "2023" } },
    ],
  },
  {
    id: "administracion-publica",
    image: { src: assetPath("/assets/i3e/adm-publica.webp"), alt: "Administración pública" },
    title: { es: "Administración pública", en: "Public administration" },
    description: {
      es: "Modernización tecnológica de la infraestructura de una administración pública: migración a la nube, refuerzo de la seguridad y soporte continuado para garantizar la continuidad de los servicios.",
      en: "Technology modernisation of a public administration infrastructure: cloud migration, reinforced security and ongoing support to ensure service continuity.",
    },
    meta: [
      { label: { es: "Ámbito", en: "Scope" }, value: { es: "Sector público", en: "Public sector" } },
      { label: { es: "Sector", en: "Sector" }, value: { es: "Público", en: "Public" } },
      { label: { es: "Servicio", en: "Service" }, value: { es: "Infraestructura", en: "Infrastructure" } },
      { label: { es: "Usuarios", en: "Users" }, value: { es: "+300", en: "+300" } },
      { label: { es: "Duración", en: "Duration" }, value: { es: "Desde 2019", en: "Since 2019" } },
    ],
  },
];

const copy = {
  hero: {
    eyebrow: { es: "Casos de éxito", en: "Success stories" },
    title: { es: "Casos de éxito", en: "Success stories" },
    intro: {
      es: "Soluciones reales que mejoran la operativa, refuerzan la seguridad y optimizan la infraestructura IT de nuestros clientes.",
      en: "Real solutions that improve operations, strengthen security and optimise our clients' IT infrastructure.",
    },
  },
  cta: {
    title: { es: "¿Te gustaría lograr resultados similares?", en: "Would you like to achieve similar results?" },
    text: {
      es: "Te ayudamos a implementar mejoras reales como las que ya han conseguido estos clientes.",
      en: "We help you roll out real improvements like the ones these clients have already achieved.",
    },
    button: { es: "Pedir información", en: "Request information" },
  },
  nav: {
    prev: { es: "Anterior caso", en: "Previous case" },
    next: { es: "Siguiente caso", en: "Next case" },
  },
};

function t<V extends { es: string; en: string }>(value: V, locale: Locale) {
  return value[locale];
}

export function CasesHub({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const total = cases.length;
  const active = cases[index];

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % total);
  }, [total]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  return (
    <div className="cases-hub-page">
      <section className="cases-hero" aria-labelledby="cases-hero-title">
        <div className="cases-hero-background" aria-hidden="true">
          <Image src="/assets/i3e/casos-de-exito-819x1024.webp" alt="" fill priority sizes="100vw" />
          <div className="cases-hero-overlay" />
        </div>
        <div className="shell cases-hero-content">
          <p className="cases-hero-eyebrow">{t(copy.hero.eyebrow, locale)}</p>
          <h1 id="cases-hero-title">{t(copy.hero.title, locale)}</h1>
          <p className="cases-hero-intro">{t(copy.hero.intro, locale)}</p>
        </div>
      </section>

      <section className="cases-carousel-section content-deferred-xl" aria-label={t(copy.hero.title, locale)}>
        <div className="shell">
          <div className="cases-carousel" role="region" aria-roledescription="carousel">
            <article className="case-feature-card" aria-live="polite">
              <div className="case-feature-media">
                <Image src={active.image.src} alt={active.image.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
              <div className="case-feature-copy">
                <h2>{t(active.title, locale)}</h2>
                <p>{t(active.description, locale)}</p>
                <div className="case-feature-meta">
                  {active.meta.map((item) => (
                    <div className="case-feature-meta-item" key={item.label.en}>
                      <span className="case-feature-meta-label">{t(item.label, locale)}</span>
                      <span className="case-feature-meta-value">{t(item.value, locale)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <div className="cases-carousel-nav" role="group" aria-label={locale === "es" ? "Navegación del carrusel" : "Carousel navigation"}>
              <button
                type="button"
                className="cases-carousel-button cases-carousel-button--prev"
                onClick={goPrev}
                aria-label={t(copy.nav.prev, locale)}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="cases-carousel-button cases-carousel-button--next"
                onClick={goNext}
                aria-label={t(copy.nav.next, locale)}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="cases-carousel-dots" role="tablist" aria-label={locale === "es" ? "Selector de caso" : "Case selector"}>
              {cases.map((caseItem, dotIndex) => (
                <button
                  key={caseItem.id}
                  type="button"
                  role="tab"
                  aria-selected={dotIndex === index}
                  aria-label={`${locale === "es" ? "Caso" : "Case"} ${dotIndex + 1}`}
                  className={`cases-carousel-dot ${dotIndex === index ? "is-active" : ""}`}
                  onClick={() => setIndex(dotIndex)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cases-cta-section content-deferred-lg">
        <div className="shell">
          <div className="cases-cta-banner">
            <div className="cases-cta-media">
              <Image src="/assets/i3e/circuitos-min.webp" alt="" fill sizes="(max-width: 900px) 100vw, 40vw" />
            </div>
            <div className="cases-cta-copy">
              <h3>{t(copy.cta.title, locale)}</h3>
              <p>{t(copy.cta.text, locale)}</p>
              <Link className="m365-button-primary" href={locale === "es" ? "/contacto" : "/en/contact"}>
                {t(copy.cta.button, locale)}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
