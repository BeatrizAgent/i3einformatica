import Image from "next/image";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import type { Locale } from "@/lib/content/repository";
import { partnerLogos } from "@/lib/site-assets";
import { templateCopy } from "@/lib/page-template-data";

export function PartnerMarquee({ locale }: { locale: Locale }) {
  const language = locale === "en" ? "en" : "es";
  const copy = templateCopy.home;
  return (
    <section className="partner-strip partner-trust content-deferred" aria-labelledby="partners-title">
      <div className="shell">
        <ScrollReveal className="section-heading" enabled>
          <p className="eyebrow">{copy.partners[language]}</p>
          <h2 id="partners-title">{copy.partnersTitle[language]}</h2>
        </ScrollReveal>
        <div className="partner-logo-marquee" aria-label={copy.partners[language]}>
          <div className="partner-logo-track">
            {[false, true].map((duplicate) => (
              <div className="partner-logo-group" aria-hidden={duplicate || undefined} key={duplicate ? "duplicate" : "original"}>
                {partnerLogos.map((logo) => (
                  <div className="partner-logo" key={`${duplicate ? "duplicate-" : ""}${logo.src}`}>
                    <Image src={logo.src} alt={duplicate ? "" : logo.alt} width={176} height={64} sizes="176px" style={{ transform: `scale(${logo.scale})` }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}