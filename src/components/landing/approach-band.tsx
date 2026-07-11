import Image from "next/image";
import { MotionRevealItem, MotionStagger, ScrollReveal } from "@/components/landing/scroll-reveal";
import type { Locale } from "@/lib/content/repository";
import { landingApproaches } from "@/lib/site-assets";
import { templateCopy } from "@/lib/page-template-data";

export function ApproachBand({ locale, enabled = true }: { locale: Locale; enabled?: boolean }) {
  const language = locale === "en" ? "en" : "es";
  const copy = templateCopy.home;
  return (
    <section className="home-approach section content-deferred-xl" aria-labelledby="approach-title">
      <div className="shell">
        <ScrollReveal className="home-approach-heading" enabled={enabled}>
          <p className="eyebrow">{copy.approachEyebrow[language]}</p>
          <h2 id="approach-title">{copy.approachTitle[language]}</h2>
        </ScrollReveal>
        <MotionStagger className="home-approach-stack" enabled={enabled}>
          {landingApproaches.map((item) => (
            <MotionRevealItem as="article" className="home-approach-card" key={item.src} enabled={enabled}>
              <div className="home-approach-media">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 42vw" />
              </div>
              <div className="home-approach-copy">
                <h3>{item.title[language]}</h3>
                <p>{item.text[language]}</p>
              </div>
            </MotionRevealItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}