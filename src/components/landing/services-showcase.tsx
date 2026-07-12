import Image from "next/image";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import type { Locale } from "@/lib/content/repository";
import type { Service } from "@/components/landing/services-data";

const rightArrow = String.fromCharCode(0x2192);

export function ServicesShowcase({ items, locale }: { items: Service[]; locale: Locale }) {
  const language = locale === "en" ? "en" : "es";

  return (
    <section className="services-showcase section content-deferred-xl" aria-labelledby="services-title">
      <div className="shell">
        <div className="services-heading">
          <p className="eyebrow">{language === "es" ? "Servicios" : "Services"}</p>
          <h2 id="services-title">{language === "es" ? "Tecnolog\u00eda preparada para avanzar" : "Technology ready to move forward"}</h2>
          <p>{language === "es" ? "Soluciones especializadas para operar con seguridad, continuidad y una base real de crecimiento." : "Specialist solutions to operate securely, continuously and with a real foundation for growth."}</p>
        </div>

        <div className="services-list">
          {items.map((item, index) => (
            <article
              className="service-card"
              key={item.href[language]}
            >
              <div className="service-card-media">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 46vw" />
              </div>
              <div className="service-card-copy">
                <BrandIcon className="service-card-icon" name={item.icon} size={40} />
                <p className="service-card-index" aria-hidden="true">0{index + 1}</p>
                <h3>{item.title[language]}</h3>
                <p className="service-card-result">{item.result[language]}</p>
                <p>{item.text[language]}</p>
                <Link className="service-card-link" href={item.href[language]}>
                  {language === "es" ? "Descubrir servicio" : "Explore service"} <span aria-hidden="true">{rightArrow}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
