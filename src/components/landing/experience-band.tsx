import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/content/repository";

const rightArrow = String.fromCharCode(0x2192);

export function ExperienceBand({ locale }: { locale: Locale }) {
  const language = locale === "en" ? "en" : "es";
  const content = language === "es"
    ? {
        eyebrow: "Experiencia",
        title: "25 a\u00f1os construyendo infraestructuras IT",
        text: "Somos un equipo t\u00e9cnico con 25 a\u00f1os de experiencia trabajando con empresas y administraciones para crear infraestructuras IT estables, seguras y ajustadas a sus necesidades reales.",
        label: "Conoce i3e",
        href: "/sobre-nosotros",
      }
    : {
        eyebrow: "Experience",
        title: "25 years building IT infrastructure",
        text: "For 25 years, our technical team has helped businesses and public organizations build stable, secure IT infrastructure tailored to real operational needs.",
        label: "Meet i3e",
        href: "/en/about-us",
      };

  return (
    <section className="experience-band content-deferred-lg" aria-labelledby="experience-title">
      <div className="experience-band-grid">
        <div className="experience-band-media">
          <Image src="/assets/i3e/25-anyos.webp" alt="Equipo técnico de i3e trabajando" fill sizes="(max-width: 700px) 100vw, 50vw" />
        </div>
        <div className="experience-band-copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="experience-title">{content.title}</h2>
          <p>{content.text}</p>
          <Link className="experience-band-link" href={content.href}>{content.label} <span aria-hidden="true">{rightArrow}</span></Link>
        </div>
      </div>
    </section>
  );
}
