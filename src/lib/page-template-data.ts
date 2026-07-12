import { assetPath } from "@/lib/public-path";
import type { SiteVisual } from "@/lib/site-assets";

export type TemplateFamily = "home" | "service" | "m365-hub" | "m365-detail" | "cases" | "company" | "contact" | "jobs" | "legal";
export type LocalizedText = { es: string; en: string };
export type TemplateCard = SiteVisual & { title: LocalizedText; text?: LocalizedText; action?: LocalizedText; href?: LocalizedText };

export const templateFamilyByPageId: Record<string, TemplateFamily> = {
  home: "home",
  m365: "m365-hub",
  "microsoft-365": "m365-hub",
  products: "m365-detail",
  "microsoft-365-products": "m365-detail",
  solutions: "m365-detail",
  "microsoft-365-solutions": "m365-detail",
  cyber: "service",
  cybersecurity: "service",
  azure: "service",
  "microsoft-azure": "service",
  infra: "service",
  "it-infrastructure": "service",
  compliance: "service",
  cases: "cases",
  "success-stories": "cases",
  company: "company",
  "about-us": "company",
  contact: "contact",
  jobs: "jobs",
  "join-team": "jobs",
  complaints: "jobs",
};

const templateKeyByPageId: Record<string, string> = {
  "microsoft-365": "m365",
  "microsoft-365-products": "products",
  "microsoft-365-solutions": "solutions",
  cybersecurity: "cyber",
  "microsoft-azure": "azure",
  "it-infrastructure": "infra",
  "success-stories": "cases",
  "about-us": "company",
  "join-team": "jobs",
};

export function templateKeyFor(pageId: string) {
  return templateKeyByPageId[pageId] ?? pageId;
}

export function templateFamilyFor(pageId: string): TemplateFamily {
  return templateFamilyByPageId[pageId] ?? "legal";
}

export const templateCopy = {
  home: {
    stats: {
      es: [{ value: "+500", label: "Clientes" }, { value: "+25", label: "Partners" }, { value: "+1000", label: "Proyectos" }],
      en: [{ value: "+500", label: "Clients" }, { value: "+25", label: "Partners" }, { value: "+1000", label: "Projects" }],
    },
    partners: { es: "Partners tecnológicos", en: "Technology partners" },
    partnersTitle: { es: "Tecnología que respalda cada proyecto", en: "Technology behind every project" },
    audienceEyebrow: { es: "Soluciones a medida", en: "Tailored solutions" },
    audienceTitle: { es: "Tecnología que se adapta a la realidad de tu organización", en: "Technology adapted to your organization" },
    audienceText: { es: "Tanto si diriges una PYME como si gestionas una gran organización, te proporcionamos soluciones que aportan estabilidad, seguridad y capacidad de crecimiento.", en: "Whether you lead an SMB or manage a large organization, we provide solutions that bring stability, security and room to grow." },
    approachEyebrow: { es: "Cómo ayudamos", en: "How we help" },
    approachTitle: { es: "Así ayudamos a las empresas e instituciones", en: "How we help businesses and institutions" },
    casesEyebrow: { es: "Experiencia aplicada", en: "Applied experience" },
    casesTitle: { es: "Casos de éxito", en: "Success stories" },
    casesText: { es: "Conectamos estrategia, tecnología y acompañamiento para resolver retos operativos complejos en organizaciones exigentes.", en: "We combine strategy, technology and close support to solve complex operational challenges in demanding organizations." },
    allCases: { es: "Ver todos los casos", en: "View all success stories" },
  },
  common: {
    howWeHelp: { es: "Cómo ayudamos", en: "How we help" },
    contactEyebrow: { es: "Escríbenos", en: "Write to us" },
    contactTitle: { es: "Cuéntanos tu proyecto", en: "Tell us about your project" },
    jobsTitle: { es: "Tu próximo paso puede empezar aquí", en: "Your next step can start here" },
    complaintTitle: { es: "Enviar comunicación", en: "Submit a report" },
    formText: { es: "Los campos marcados son obligatorios. Trataremos tus datos solo para gestionar esta solicitud.", en: "Marked fields are required. We will only process this data to handle your request." },
    caseLabel: { es: "Caso de éxito", en: "Success story" },
    locations: { es: "Dónde encontrarnos", en: "Where to find us" },
    locationsTitle: { es: "Nuestras oficinas", en: "Our offices" },
    locationsText: { es: "Cobertura próxima en Cataluña, Madrid y el resto de España.", en: "Local coverage across Catalonia, Madrid and the rest of Spain." },
  },
} as const;

export const pageMedia: Partial<Record<string, SiteVisual[]>> = {
  cyber: [
    { src: assetPath("/assets/i3e/proteccion-2-min.webp"), alt: "Protección ante amenazas digitales" },
    { src: assetPath("/assets/i3e/evaluacion-min.webp"), alt: "Evaluación de riesgos de ciberseguridad" },
    { src: assetPath("/assets/i3e/planificacion-min.webp"), alt: "Planificación de ciberseguridad" },
  ],
  azure: [
    { src: assetPath("/assets/i3e/infraestructura-migracion-min.webp"), alt: "Migración de infraestructura a Microsoft Azure" },
    { src: assetPath("/assets/i3e/seguridad-min.webp"), alt: "Seguridad de entornos cloud" },
    { src: assetPath("/assets/i3e/microsoft-azure-min.webp"), alt: "Servicios Microsoft Azure" },
  ],
  infra: [
    { src: assetPath("/assets/i3e/instalacion-min.webp"), alt: "Instalación de infraestructura IT" },
    { src: assetPath("/assets/i3e/soporte-min.webp"), alt: "Soporte de infraestructura IT" },
    { src: assetPath("/assets/i3e/insfraestructuras-it-min.webp"), alt: "Infraestructuras IT empresariales" },
  ],
  compliance: [
    { src: assetPath("/assets/i3e/compliance-min.webp"), alt: "Compliance tecnológico" },
    { src: assetPath("/assets/i3e/implementacion-iso-min.webp"), alt: "Implementación de ISO 27001" },
    { src: assetPath("/assets/i3e/implementacion-normativas-min.webp"), alt: "Implementación de normativas" },
  ],
  products: [
    { src: assetPath("/assets/i3e/migracion-min.webp"), alt: "Migración a Microsoft 365" },
    { src: assetPath("/assets/i3e/migracion-sharepoint-min.webp"), alt: "Microsoft 365 y SharePoint" },
    { src: assetPath("/assets/i3e/copilot-min.webp"), alt: "Microsoft Copilot" },
  ],
  solutions: [
    { src: assetPath("/assets/i3e/soluciones-1024x768.webp"), alt: "Soluciones Microsoft 365" },
    { src: assetPath("/assets/i3e/migracion-min.webp"), alt: "Migración a Microsoft 365" },
  ],
  company: [{ src: assetPath("/assets/i3e/10.webp"), alt: "Equipo de i3e Informática" }],
  jobs: [{ src: assetPath("/assets/i3e/cultura-organizacional-empresarial.webp"), alt: "Cultura organizacional de i3e" }],
  contact: [
    { src: assetPath("/assets/i3e/contacto-min.webp"), alt: "Contacto con i3e Informática" },
    { src: assetPath("/assets/i3e/hospi3.webp"), alt: "Oficina i3e L'Hospitalet" },
    { src: assetPath("/assets/i3e/madrid.webp"), alt: "Oficina i3e Madrid" },
    { src: assetPath("/assets/i3e/mataro2.webp"), alt: "Oficina i3e Mataró" },
    { src: assetPath("/assets/i3e/celra1-1024x1024.webp"), alt: "Oficina i3e Celrà" },
  ],
};

export const m365HubCards: { product: TemplateCard; solutions: TemplateCard } = {
  product: {
    src: assetPath("/assets/i3e/migracion-min.webp"),
    alt: "Migración a Microsoft 365",
    title: { es: "Producto", en: "Product" },
    text: { es: "Microsoft 365 es una plataforma cloud que permite trabajar de forma coordinada, segura y eficiente. Configuramos y gestionamos cada entorno para responder a la gobernanza, seguridad documental y automatización de cada organización.", en: "Microsoft 365 is a cloud platform that enables coordinated, secure and efficient work. We configure and manage each environment around governance, document security and automation." },
    action: { es: "Ver productos", en: "View products" },
    href: { es: "/microsoft-365/producto", en: "/en/microsoft-365/microsoft-365-products" },
  },
  solutions: {
    src: assetPath("/assets/i3e/soluciones-1024x768.webp"),
    alt: "Soluciones Microsoft 365",
    title: { es: "Soluciones", en: "Solutions" },
    text: { es: "Configuramos, acompañamos y gestionamos tu entorno Microsoft 365 desde el inicio: permisos, seguridad y administración clara para escalar sin fricciones.", en: "We configure, support and manage your Microsoft 365 environment from the start: permissions, security and clear administration to scale without friction." },
    action: { es: "Ver soluciones", en: "View solutions" },
    href: { es: "/microsoft-365/soluciones", en: "/en/microsoft-365/microsoft-365-solutions" },
  },
};

export const m365HubItems: TemplateCard[] = [
  { src: assetPath("/assets/i3e/migracion-min.webp"), alt: "Microsoft 365", title: { es: "Microsoft 365", en: "Microsoft 365" }, href: { es: "/microsoft-365/producto", en: "/en/microsoft-365/microsoft-365-products" } },
  { src: assetPath("/assets/i3e/copilot-min.webp"), alt: "Microsoft Copilot", title: { es: "Copilot", en: "Copilot" }, href: { es: "/microsoft-365/producto", en: "/en/microsoft-365/microsoft-365-products" } },
  { src: assetPath("/assets/i3e/migracion-sharepoint-min.webp"), alt: "Microsoft SharePoint", title: { es: "SharePoint", en: "SharePoint" }, href: { es: "/microsoft-365/producto", en: "/en/microsoft-365/microsoft-365-products" } },
  { src: assetPath("/assets/i3e/soluciones-1024x768.webp"), alt: "Teams y colaboración", title: { es: "Teams y colaboración", en: "Teams and collaboration" }, href: { es: "/microsoft-365/soluciones", en: "/en/microsoft-365/microsoft-365-solutions" } },
];

export const caseCards: TemplateCard[] = [
  { src: assetPath("/assets/i3e/toyota.webp"), alt: "Caso de éxito Toyota Starbaix", title: { es: "Toyota Starbaix", en: "Toyota Starbaix" }, href: { es: "/casos-de-exito", en: "/en/success-stories" } },
  { src: assetPath("/assets/i3e/adm-publica.webp"), alt: "Caso de éxito de administración pública", title: { es: "Administración pública", en: "Public administration" }, href: { es: "/casos-de-exito", en: "/en/success-stories" } },
  { src: assetPath("/assets/i3e/entidad-bancaria.webp"), alt: "Caso de éxito de entidad bancaria", title: { es: "Gran entidad bancaria", en: "Major banking institution" }, href: { es: "/casos-de-exito", en: "/en/success-stories" } },
];

export const contactLocations: TemplateCard[] = [
  { src: assetPath("/assets/i3e/hospi3.webp"), alt: "Oficina i3e L'Hospitalet", title: { es: "L'Hospitalet de Llobregat", en: "L'Hospitalet de Llobregat" }, text: { es: "C/ Crom 35-37, 5º · 08907 Barcelona", en: "C/ Crom 35-37, 5th floor · 08907 Barcelona" } },
  { src: assetPath("/assets/i3e/madrid.webp"), alt: "Oficina i3e Madrid", title: { es: "Madrid", en: "Madrid" }, text: { es: "Atención comercial y técnica", en: "Commercial and technical support" } },
  { src: assetPath("/assets/i3e/mataro2.webp"), alt: "Oficina i3e Mataró", title: { es: "Mataró", en: "Mataró" }, text: { es: "Soporte y servicios IT", en: "IT support and services" } },
  { src: assetPath("/assets/i3e/celra1-1024x1024.webp"), alt: "Oficina i3e Celrà", title: { es: "Celrà", en: "Celrà" }, text: { es: "Cobertura de servicios gestionados", en: "Managed-services coverage" } },
];
