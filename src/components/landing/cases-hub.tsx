import Image from "next/image";

import { assetPath } from "@/lib/public-path";
import { caseSupportVisuals } from "@/lib/site-assets";

type Locale = "es" | "en";

type CaseStudyMeta = {
  label: { es: string; en: string };
  value: { es: string; en: string };
};

type CaseStudy = {
  id: string;
  image: { src: string; alt: string };
  title: { es: string; en: string };
  description: { es: string; en: string };
  meta: CaseStudyMeta[];
};

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
    image: { src: assetPath("/assets/i3e/entidad-bancaria.webp"), alt: "Gran entidad bancaria" },
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
    title: { es: "Administración Pública", en: "Public administration" },
    description: {
      es: "Gestión on-site de todas las redes de la administración pública (interdepartamental) de la comunidad autónoma, gestionando las incidencias y dando servicio 24/7 con SLA de 4 horas.",
      en: "On-site management of all public administration networks across the autonomous community, handling incidents and delivering 24/7 service with a four-hour SLA.",
    },
    meta: [
      { label: { es: "Ámbito", en: "Scope" }, value: { es: "Seguridad", en: "Security" } },
      { label: { es: "Sector", en: "Sector" }, value: { es: "Público", en: "Public" } },
      { label: { es: "Servicio", en: "Service" }, value: { es: "Redes", en: "Networks" } },
      { label: { es: "Usuarios", en: "Users" }, value: { es: "+1000", en: "+1000" } },
      { label: { es: "Duración", en: "Duration" }, value: { es: "Desde 2016", en: "Since 2016" } },
    ],
  },
];

const copy = {
  eyebrow: { es: "Experiencia aplicada", en: "Applied experience" },
  title: { es: "Casos de éxito", en: "Success stories" },
  intro: {
    es: "Tres proyectos. Tres retos distintos. Una misma forma de trabajar: tecnología útil, ejecución rigurosa y resultados medibles.",
    en: "Three projects. Three different challenges. One consistent way of working: useful technology, rigorous execution and measurable results.",
  },
};

function text(value: { es: string; en: string }, locale: Locale) {
  return value[locale];
}

export function CasesHub({ locale }: { locale: Locale }) {
  return (
    <div className="cases-hub-page">
      <section className="cases-heading-section" aria-labelledby="cases-title">
        <div className="shell cases-heading">
          <div className="cases-heading-copy">
            <p className="cases-eyebrow">{text(copy.eyebrow, locale)}</p>
            <h1 id="cases-title">{text(copy.title, locale)}</h1>
            <p>{text(copy.intro, locale)}</p>
          </div>
          <div className="cases-visual-mosaic" aria-label={locale === "es" ? "Perspectivas visuales de nuestros proyectos" : "Visual perspectives from our projects"}>
            {caseSupportVisuals.map((visual, index) => (
              <div className={`cases-visual-tile cases-visual-tile--${index + 1}`} key={visual.src}>
                <Image src={visual.src} alt={text(visual.alt, locale)} fill sizes="(max-width: 900px) 33vw, 18vw" />
                <span className="cases-visual-label">{text(visual.label, locale)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="cases-list-section" aria-label={text(copy.title, locale)}>
        <div className="shell cases-list">
          {cases.map((item, index) => (
            <article className={`case-feature-card ${index % 2 === 1 ? "case-feature-card--reverse" : ""}`} key={item.id}>
              <div className="case-feature-media">
                <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
              <div className="case-feature-copy">
                <p className="case-feature-index">0{index + 1}</p>
                <h2>{text(item.title, locale)}</h2>
                <p>{text(item.description, locale)}</p>
                <div className="case-feature-meta">
                  {item.meta.map((meta) => (
                    <div className="case-feature-meta-item" key={meta.label.en}>
                      <span className="case-feature-meta-label">{text(meta.label, locale)}</span>
                      <span className="case-feature-meta-value">{text(meta.value, locale)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
