import { assetPath } from "@/lib/public-path";
export type SiteVisual = { src: string; alt: string };
export type PartnerLogo = SiteVisual & { scale: number };
export type LandingVisual = SiteVisual & {
  title: { es: string; en: string };
  text: { es: string; en: string };
  href: { es: string; en: string };
};
export type LandingApproach = SiteVisual & {
  title: { es: string; en: string };
  text: { es: string; en: string };
};

export type Capability = SiteVisual & {
  label: { es: string; en: string };
  href: { es: string; en: string };
};

export type Service = SiteVisual & {
  icon: string;
  title: { es: string; en: string };
  result: { es: string; en: string };
  text: { es: string; en: string };
  href: { es: string; en: string };
};

export const siteVisuals: Record<string, SiteVisual> = {
  home: { src: assetPath("/assets/i3e/portail-min.webp"), alt: "Infraestructura IT de i3e Informática" },
  m365: { src: assetPath("/assets/i3e/migracion-min.webp"), alt: "Migración a Microsoft 365" },
  products: { src: assetPath("/assets/i3e/migracion-sharepoint-min.webp"), alt: "Microsoft 365 y SharePoint" },
  solutions: { src: assetPath("/assets/i3e/migracion-min.webp"), alt: "Soluciones Microsoft 365" },
  cyber: { src: assetPath("/assets/i3e/proteccion-2-min.webp"), alt: "Protección y ciberseguridad" },
  azure: { src: assetPath("/assets/i3e/infraestructura-migracion-min.webp"), alt: "Infraestructura Microsoft Azure" },
  infra: { src: assetPath("/assets/i3e/instalacion-min.webp"), alt: "Instalación de infraestructura IT" },
  compliance: { src: assetPath("/assets/i3e/implementacion-iso-min.webp"), alt: "Implementación de certificaciones ISO" },
  cases: { src: assetPath("/assets/i3e/toyota.webp"), alt: "Caso de éxito Toyota Starbaix" },
  company: { src: assetPath("/assets/i3e/adm-publica.webp"), alt: "Proyecto de tecnología para administración pública" },
  contact: { src: assetPath("/assets/i3e/contacto-min.webp"), alt: "Contacto con i3e Informática" },
};

export const generatedLandingVisuals = {
  hero: { src: assetPath("/assets/i3e/generated/i3e-ecosystem-hero.webp"), alt: "Ecosistema digital conectado de i3e" },
  m365: { src: assetPath("/assets/i3e/generated/i3e-microsoft-365.webp"), alt: "Entorno visual de colaboración segura" },
  cybersecurity: { src: assetPath("/assets/i3e/generated/i3e-cybersecurity.webp"), alt: "Escudo visual de ciberresiliencia" },
  azure: { src: assetPath("/assets/i3e/generated/i3e-cloud-infrastructure.webp"), alt: "Infraestructura cloud escalable" },
  infrastructure: { src: assetPath("/assets/i3e/generated/i3e-it-infrastructure.webp"), alt: "Red de infraestructura IT resiliente" },
  compliance: { src: assetPath("/assets/i3e/generated/i3e-compliance.webp"), alt: "Gobernanza y control tecnológico" },
} satisfies Record<string, SiteVisual>;

export const partnerLogos: PartnerLogo[] = [
  { src: assetPath("/assets/i3e/barracuda_authorized_partner_bn.webp"), alt: "Barracuda Authorized Partner", scale: 1.25 },
  { src: assetPath("/assets/i3e/cisco_partner_bn.webp"), alt: "Cisco Partner", scale: 1.2 },
  { src: assetPath("/assets/i3e/hp_gold_partner_bn.webp"), alt: "HP Gold Partner", scale: 1.05 },
  { src: assetPath("/assets/i3e/paloalto_networks_bn.webp"), alt: "Palo Alto Networks", scale: 1.45 },
  { src: assetPath("/assets/i3e/intel-partner-gold-1-768x768.webp"), alt: "Intel Partner Gold", scale: 2.15 },
  { src: assetPath("/assets/i3e/logo-epson-partner-768x768.webp"), alt: "Epson IT Partner", scale: 2.5 },
];

export const serviceIcons: SiteVisual[] = [
  { src: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg"), alt: "Microsoft 365" },
  { src: assetPath("/assets/i3e/arcticons-security-2.svg"), alt: "Ciberseguridad" },
  { src: assetPath("/assets/i3e/arcticons-microsoft-azure-2.svg"), alt: "Microsoft Azure" },
  { src: assetPath("/assets/i3e/arcticons-serverbox-2.svg"), alt: "Infraestructuras IT" },
  { src: assetPath("/assets/i3e/cert-2.svg"), alt: "Certificaciones" },
];

export const landingCapabilities: Capability[] = [
  {
    src: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg"),
    alt: "Microsoft 365",
    label: { es: "Microsoft 365", en: "Microsoft 365" },
    href: { es: "/microsoft-365", en: "/en/microsoft-365" },
  },
  {
    src: assetPath("/assets/i3e/arcticons-security-2.svg"),
    alt: "Ciberseguridad",
    label: { es: "Ciberseguridad", en: "Cybersecurity" },
    href: { es: "/ciberseguridad", en: "/en/cybersecurity" },
  },
  {
    src: assetPath("/assets/i3e/arcticons-microsoft-azure-2.svg"),
    alt: "Microsoft Azure",
    label: { es: "Microsoft Azure", en: "Microsoft Azure" },
    href: { es: "/microsoft-azure", en: "/en/microsoft-azure" },
  },
  {
    src: assetPath("/assets/i3e/arcticons-serverbox-2.svg"),
    alt: "Infraestructuras IT",
    label: { es: "Infraestructuras IT", en: "IT infrastructure" },
    href: { es: "/infraestructuras-it", en: "/en/it-infrastructure" },
  },
  {
    src: assetPath("/assets/i3e/cert-2.svg"),
    alt: "Certificaciones",
    label: { es: "Certificaciones", en: "Certifications" },
    href: { es: "/compliance-y-certificaciones", en: "/en/compliance-and-certifications" },
  },
];

export const landingServices: Service[] = [
  {
    src: assetPath("/assets/i3e/migracion-min.webp"),
    alt: "Equipo trabajando con soluciones Microsoft 365",
    icon: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg"),
    title: { es: "Microsoft 365", en: "Microsoft 365" },
    result: { es: "Trabajo seguro y conectado", en: "Secure, connected work" },
    text: { es: "Diseñamos, migramos y damos soporte a entornos que facilitan colaborar sin perder control sobre la información.", en: "We design, migrate and support environments that make collaboration easier without losing control of information." },
    href: { es: "/microsoft-365", en: "/en/microsoft-365" },
  },
  {
    src: assetPath("/assets/i3e/proteccion-2-min.webp"),
    alt: "Protección de infraestructura frente a amenazas digitales",
    icon: assetPath("/assets/i3e/arcticons-security-2.svg"),
    title: { es: "Ciberseguridad", en: "Cybersecurity" },
    result: { es: "Riesgos bajo control", en: "Risks under control" },
    text: { es: "Reducimos superficie de ataque, respondemos ante incidentes y protegemos la continuidad de tu organización.", en: "We reduce attack surface, respond to incidents and protect the continuity of your organization." },
    href: { es: "/ciberseguridad", en: "/en/cybersecurity" },
  },
  {
    src: assetPath("/assets/i3e/infraestructura-migracion-min.webp"),
    alt: "Infraestructura cloud Microsoft Azure",
    icon: assetPath("/assets/i3e/arcticons-microsoft-azure-2.svg"),
    title: { es: "Microsoft Azure", en: "Microsoft Azure" },
    result: { es: "Cloud que acompaña el crecimiento", en: "Cloud that supports growth" },
    text: { es: "Construimos entornos cloud escalables, gobernados y ajustados a la operativa, el rendimiento y los costes.", en: "We build scalable, governed cloud environments tailored to operations, performance and cost." },
    href: { es: "/microsoft-azure", en: "/en/microsoft-azure" },
  },
  {
    src: assetPath("/assets/i3e/instalacion-min.webp"),
    alt: "Infraestructura IT y servidores empresariales",
    icon: assetPath("/assets/i3e/arcticons-serverbox-2.svg"),
    title: { es: "Infraestructuras IT", en: "IT infrastructure" },
    result: { es: "Operación estable cada día", en: "Stable day-to-day operations" },
    text: { es: "Modernizamos redes, servidores y sistemas híbridos para que la tecnología no frene la actividad de tu equipo.", en: "We modernize networks, servers and hybrid systems so technology never slows your team down." },
    href: { es: "/infraestructuras-it", en: "/en/it-infrastructure" },
  },
  {
    src: assetPath("/assets/i3e/implementacion-iso-min.webp"),
    alt: "Cumplimiento y certificaciones de seguridad",
    icon: assetPath("/assets/i3e/cert-2.svg"),
    title: { es: "Compliance y certificaciones", en: "Compliance and certifications" },
    result: { es: "Cumplimiento demostrable", en: "Demonstrable compliance" },
    text: { es: "Convertimos requisitos como ISO 27001, ENS, NIS2 y RGPD en procesos claros, sostenibles y verificables.", en: "We turn requirements such as ISO 27001, ENS, NIS2 and GDPR into clear, sustainable and verifiable processes." },
    href: { es: "/compliance-y-certificaciones", en: "/en/compliance-and-certifications" },
  },
];

export const landingSolutions: LandingVisual[] = [
  {
    src: assetPath("/assets/i3e/empresas-rect.webp"),
    alt: "Equipo profesional trabajando con tecnología empresarial",
    title: { es: "Grandes empresas", en: "Enterprise" },
    text: { es: "Infraestructura híbrida, continuidad y control para operaciones críticas.", en: "Hybrid infrastructure, continuity and control for critical operations." },
    href: { es: "/infraestructuras-it", en: "/en/it-infrastructure" },
  },
  {
    src: assetPath("/assets/i3e/pymes-rect.webp"),
    alt: "Profesional utilizando soluciones digitales para una PYME",
    title: { es: "PYMEs", en: "SMBs" },
    text: { es: "Tecnología robusta y cercana, adaptada a tu ritmo de crecimiento.", en: "Robust, human technology adapted to your pace of growth." },
    href: { es: "/microsoft-365", en: "/en/microsoft-365" },
  },
  {
    src: assetPath("/assets/i3e/proteccion-2-min.webp"),
    alt: "Centro de operaciones protegido frente a amenazas digitales",
    title: { es: "Ciberseguridad", en: "Cybersecurity" },
    text: { es: "Prevenir, detectar y responder para que tu negocio siga avanzando.", en: "Prevent, detect and respond so your business keeps moving." },
    href: { es: "/ciberseguridad", en: "/en/cybersecurity" },
  },
];

export const landingApproaches: LandingApproach[] = [
  {
    src: assetPath("/assets/i3e/approach-consulting-original.jpg"),
    alt: "Análisis tecnológico y consultoría",
    title: { es: "Consultoría", en: "Consulting" },
    text: { es: "Analizamos tu infraestructura, detectamos riesgos y definimos una hoja de ruta clara para mejorar estabilidad, seguridad y rendimiento.", en: "We assess your infrastructure, identify risks and define a clear roadmap to improve stability, security and performance." },
  },
  {
    src: assetPath("/assets/i3e/approach-implementation-original.jpg"),
    alt: "Implementación de controles tecnológicos",
    title: { es: "Implementación", en: "Implementation" },
    text: { es: "Aplicamos las soluciones necesarias para modernizar el entorno sin interrumpir la operativa de tu organización.", en: "We apply the solutions needed to modernize your environment without interrupting your operations." },
  },
  {
    src: assetPath("/assets/i3e/approach-managed-original.jpg"),
    alt: "Soporte y servicios tecnológicos gestionados",
    title: { es: "Servicios gestionados", en: "Managed services" },
    text: { es: "Mantenemos tu infraestructura operativa, actualizada y bajo control para que tu equipo se centre en hacer crecer el negocio.", en: "We keep your infrastructure operational, up to date and under control so your team can focus on growing the business." },
  },
];

export const landingCases: LandingVisual[] = [
  {
    src: assetPath("/assets/i3e/toyota.webp"),
    alt: "Caso de éxito de i3e en el sector industrial",
    title: { es: "Industria", en: "Industry" },
    text: { es: "Entornos preparados para trabajar sin interrupciones.", en: "Environments built to keep operations moving." },
    href: { es: "/casos-de-exito", en: "/en/success-stories" },
  },
  {
    src: assetPath("/assets/i3e/entidad-bancaria.webp"),
    alt: "Infraestructura tecnológica para una entidad bancaria",
    title: { es: "Servicios financieros", en: "Financial services" },
    text: { es: "Seguridad, cumplimiento y trazabilidad en cada capa.", en: "Security, compliance and traceability at every layer." },
    href: { es: "/casos-de-exito", en: "/en/success-stories" },
  },
  {
    src: assetPath("/assets/i3e/adm-publica.webp"),
    alt: "Proyecto tecnológico para la administración pública",
    title: { es: "Administración pública", en: "Public sector" },
    text: { es: "Tecnología fiable para servicios que importan.", en: "Reliable technology for services that matter." },
    href: { es: "/casos-de-exito", en: "/en/success-stories" },
  },
];

export const caseSupportVisuals = [
  { src: assetPath("/assets/i3e/generated/cases/cases-visual-network.webp"), alt: { es: "Red digital segura", en: "Secure digital network" }, label: { es: "Conectividad", en: "Connectivity" } },
  { src: assetPath("/assets/i3e/generated/cases/cases-visual-cloud.webp"), alt: { es: "Infraestructura cloud", en: "Cloud infrastructure" }, label: { es: "Cloud", en: "Cloud" } },
  { src: assetPath("/assets/i3e/generated/cases/cases-visual-fiber.webp"), alt: { es: "Flujo seguro de datos", en: "Secure data flow" }, label: { es: "Datos", en: "Data" } },
  { src: assetPath("/assets/i3e/generated/cases/cases-visual-public.webp"), alt: { es: "Infraestructura pública conectada", en: "Connected public infrastructure" }, label: { es: "Servicio público", en: "Public service" } },
  { src: assetPath("/assets/i3e/generated/cases/cases-visual-results.webp"), alt: { es: "Resultados medibles", en: "Measurable results" }, label: { es: "Resultados", en: "Outcomes" } },
] satisfies Array<{ src: string; alt: { es: string; en: string }; label: { es: string; en: string } }>;

export const faviconAsset = assetPath("/assets/i3e/favicon-i3e-300x300.webp");
