import { assetPath } from "@/lib/public-path";
import { generatedLandingVisuals } from "@/lib/site-assets";

export type Service = {
  src: string;
  alt: string;
  icon: string;
  title: { es: string; en: string };
  result: { es: string; en: string };
  text: { es: string; en: string };
  href: { es: string; en: string };
};

export const landingServices: Service[] = [
  {
    src: generatedLandingVisuals.m365.src,
    alt: "Equipo trabajando con soluciones Microsoft 365",
    icon: assetPath("/assets/i3e/arcticons-microsoft-365-2.svg"),
    title: { es: "Microsoft 365", en: "Microsoft 365" },
    result: { es: "Trabajo seguro y conectado", en: "Secure, connected work" },
    text: { es: "Dise\u00f1amos, migramos y damos soporte a entornos que facilitan colaborar sin perder control sobre la informaci\u00f3n.", en: "We design, migrate and support environments that make collaboration easier without losing control of information." },
    href: { es: "/microsoft-365", en: "/en/microsoft-365" },
  },
  {
    src: generatedLandingVisuals.cybersecurity.src,
    alt: "Protecci\u00f3n de infraestructura frente a amenazas digitales",
    icon: assetPath("/assets/i3e/arcticons-security-2.svg"),
    title: { es: "Ciberseguridad", en: "Cybersecurity" },
    result: { es: "Riesgos bajo control", en: "Risks under control" },
    text: { es: "Reducimos superficie de ataque, respondemos ante incidentes y protegemos la continuidad de tu organizaci\u00f3n.", en: "We reduce attack surface, respond to incidents and protect the continuity of your organization." },
    href: { es: "/ciberseguridad", en: "/en/cybersecurity" },
  },
  {
    src: generatedLandingVisuals.azure.src,
    alt: "Infraestructura cloud Microsoft Azure",
    icon: assetPath("/assets/i3e/arcticons-microsoft-azure-2.svg"),
    title: { es: "Microsoft Azure", en: "Microsoft Azure" },
    result: { es: "Cloud que acompa\u00f1a el crecimiento", en: "Cloud that supports growth" },
    text: { es: "Construimos entornos cloud escalables, gobernados y ajustados a la operativa, el rendimiento y los costes.", en: "We build scalable, governed cloud environments tailored to operations, performance and cost." },
    href: { es: "/microsoft-azure", en: "/en/microsoft-azure" },
  },
  {
    src: generatedLandingVisuals.infrastructure.src,
    alt: "Infraestructura IT y servidores empresariales",
    icon: assetPath("/assets/i3e/arcticons-serverbox-2.svg"),
    title: { es: "Infraestructuras IT", en: "IT infrastructure" },
    result: { es: "Operaci\u00f3n estable cada d\u00eda", en: "Stable day-to-day operations" },
    text: { es: "Modernizamos redes, servidores y sistemas h\u00edbridos para que la tecnolog\u00eda no frene la actividad de tu equipo.", en: "We modernize networks, servers and hybrid systems so technology never slows your team down." },
    href: { es: "/infraestructuras-it", en: "/en/it-infrastructure" },
  },
  {
    src: generatedLandingVisuals.compliance.src,
    alt: "Cumplimiento y certificaciones de seguridad",
    icon: assetPath("/assets/i3e/cert-2.svg"),
    title: { es: "Compliance y certificaciones", en: "Compliance and certifications" },
    result: { es: "Cumplimiento demostrable", en: "Demonstrable compliance" },
    text: { es: "Convertimos requisitos como ISO 27001, ENS, NIS2 y RGPD en procesos claros, sostenibles y verificables.", en: "We turn requirements such as ISO 27001, ENS, NIS2 and GDPR into clear, sustainable and verifiable processes." },
    href: { es: "/compliance-y-certificaciones", en: "/en/compliance-and-certifications" },
  },
];
