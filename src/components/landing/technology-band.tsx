import Image from "next/image";

type TechBandLocale = "es" | "en";

const copy = {
  es: {
    title: "Tecnologías con las que trabajamos",
  },
  en: {
    title: "Technologies we work with",
  },
};

const technologies = [
  { name: "Microsoft 365", icon: "/assets/i3e/arcticons-microsoft-365-2.svg" },
  { name: "Microsoft Azure", icon: "/assets/i3e/arcticons-microsoft-azure-2.svg" },
  { name: "SharePoint", icon: "/assets/i3e/arcticons-microsoft-365-2.svg" },
  { name: "Palo Alto Networks", icon: "/assets/i3e/paloalto_networks_bn.webp" },
  { name: "Cisco Partner", icon: "/assets/i3e/cisco_partner_bn.webp" },
  { name: "HP Partner", icon: "/assets/i3e/hp_gold_partner_bn.webp" },
  { name: "Barracuda Partner", icon: "/assets/i3e/barracuda_authorized_partner_bn.webp" },
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
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={tech.icon.endsWith(".svg") ? 36 : 80}
                  height={tech.icon.endsWith(".svg") ? 36 : 36}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <span className="tech-band-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
