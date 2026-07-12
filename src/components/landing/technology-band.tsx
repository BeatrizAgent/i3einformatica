import Image from "next/image";
import { BrandIcon, type BrandIconName } from "@/components/brand-icon";
import { assetPath } from "@/lib/public-path";

type TechBandLocale = "es" | "en";

const copy = {
  es: {
    title: "Tecnologías con las que trabajamos",
  },
  en: {
    title: "Technologies we work with",
  },
};

const technologies: Array<{ name: string; brand?: BrandIconName; image?: string }> = [
  { name: "Microsoft 365", brand: "microsoft365" },
  { name: "Microsoft Azure", brand: "azure" },
  { name: "SharePoint", brand: "sharepoint" },
  { name: "Palo Alto Networks", brand: "paloalto" },
  { name: "Cisco Partner", brand: "cisco" },
  { name: "HP Partner", brand: "hp" },
  { name: "Barracuda Partner", image: assetPath("/assets/i3e/barracuda_authorized_partner_bn.webp") },
];

export function TechnologyBand({ locale }: { locale: TechBandLocale }) {
  const text = copy[locale];

  return (
    <section className="tech-band-section" aria-label={text.title}>
      <div className="shell">
        <h3 className="tech-band-title">{text.title}</h3>
        <div className="tech-band-grid">
          {technologies.map((tech) => (
            <div className="tech-band-item" key={tech.name}>
              <div className="tech-band-logo">
                {tech.brand ? <BrandIcon name={tech.brand} size={88} /> : (
                  <Image className="tech-band-logo-image" src={tech.image ?? ""} alt={tech.name} width={144} height={72} />
                )}
              </div>
              <span className="tech-band-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
