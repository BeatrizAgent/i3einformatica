import Image from "next/image";
import Link from "next/link";
import { BrandIcon, type BrandIconName } from "@/components/brand-icon";
import { assetPath } from "@/lib/public-path";

export type HeroLocale = "es" | "en";

type HeroNetworkServiceId = "m365" | "cyber" | "azure" | "infra" | "compliance";

type HeroNetworkService = {
  id: HeroNetworkServiceId;
  label: string;
  detail: string;
  href: string;
  icon: BrandIconName;
};

export const heroNetworkServices: Record<HeroLocale, readonly HeroNetworkService[]> = {
  es: [
    { id: "m365", label: "Microsoft 365", detail: "Trabajo conectado", href: "/microsoft-365", icon: "microsoft365" },
    { id: "cyber", label: "Ciberseguridad", detail: "Riesgos bajo control", href: "/ciberseguridad", icon: "security" },
    { id: "azure", label: "Microsoft Azure", detail: "Cloud escalable", href: "/microsoft-azure", icon: "azure" },
    { id: "infra", label: "Infraestructura IT", detail: "Operaci\u00f3n estable", href: "/infraestructuras-it", icon: "serverbox" },
    { id: "compliance", label: "Compliance y certificaciones", detail: "Cumplimiento continuo", href: "/compliance-y-certificaciones", icon: "shield" },
  ],
  en: [
    { id: "m365", label: "Microsoft 365", detail: "Connected work", href: "/en/microsoft-365", icon: "microsoft365" },
    { id: "cyber", label: "Cybersecurity", detail: "Risks under control", href: "/en/cybersecurity", icon: "security" },
    { id: "azure", label: "Microsoft Azure", detail: "Scalable cloud", href: "/en/microsoft-azure", icon: "azure" },
    { id: "infra", label: "IT infrastructure", detail: "Stable operations", href: "/en/it-infrastructure", icon: "serverbox" },
    { id: "compliance", label: "Compliance & certifications", detail: "Continuous compliance", href: "/en/compliance-and-certifications", icon: "shield" },
  ],
};

const heroNetworkCopy: Record<HeroLocale, { label: string; description: string }> = {
  es: { label: "Ecosistema i3e", description: "Un \u00fanico equipo. Todas las capas cr\u00edticas." },
  en: { label: "i3e ecosystem", description: "One team. Every critical layer." },
};

const desktopNetworkPaths = [
  "M360 334 C326 274 202 248 126 142",
  "M360 334 C348 244 338 166 360 72",
  "M360 334 C394 274 518 248 594 142",
  "M360 334 C428 316 530 292 610 246",
  "M360 334 C292 316 190 292 110 246",
];

export function HeroNetwork({ locale }: { locale: HeroLocale }) {
  const services = heroNetworkServices[locale];
  const copy = heroNetworkCopy[locale];

  return (
    <aside className="hero-network" aria-label={copy.label}>
      <svg className="hero-network-mobile-lines" viewBox="0 0 360 360" aria-hidden="true" focusable="false">
        <path className="hero-network-mobile-path" d="M114 60 H124 M236 60 H246 M180 114 V132 M180 180 H190" />
        <path className="hero-network-mobile-path" d="M122 244 C108 278 102 294 144 310 M238 244 C252 278 258 294 216 310" />
      </svg>
      <svg className="hero-network-lines" viewBox="0 0 720 420" aria-hidden="true" focusable="false">
        {desktopNetworkPaths.map((path, index) => (
          <g key={path}>
            <path className="hero-network-path" d={path} pathLength="1" />
            <circle className="hero-network-packet" r="4">
              <animateMotion dur={`${6.5 + index * 0.45}s`} repeatCount="indefinite" path={path} />
            </circle>
          </g>
        ))}
        <circle className="hero-network-hub-ring" cx="360" cy="334" r="48" />
      </svg>
      <div className="hero-network-hub">
        <Image className="hero-network-logo" src={assetPath("/assets/i3e/logo-i3e-25-300x198.webp")} alt="i3e" width={92} height={62} sizes="92px" priority />
        <small>{copy.description}</small>
      </div>
      {services.map((service) => (
        <Link className={`hero-network-node hero-network-node--${service.id}`} href={service.href} key={service.id} aria-label={`${service.label}: ${service.detail}`}>
          <BrandIcon name={service.icon} size={32} />
          <span>{service.label}</span>
          <small>{service.detail}</small>
        </Link>
      ))}
    </aside>
  );
}
