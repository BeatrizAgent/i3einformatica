import Image from "next/image";
import Link from "next/link";
import { UiIcon } from "@/components/ui-icon";
import type { Locale } from "@/lib/content/repository";
import { caseCards, templateCopy } from "@/lib/page-template-data";

export function CasesGrid({ locale, showHeading = true, showLink = true }: { locale: Locale; showHeading?: boolean; showLink?: boolean }) {
  const language = locale === "en" ? "en" : "es";
  const copy = templateCopy.home;
  const caseHref = language === "es" ? "/casos-de-exito" : "/en/success-stories";
  return (
    <section className="section landing-cases" aria-labelledby="landing-cases-title">
      <div className="shell">
        {showHeading && (
          <div className="landing-cases-heading">
            <div>
              <p className="eyebrow">{copy.casesEyebrow[language]}</p>
              <h2 id="landing-cases-title">{copy.casesTitle[language]}</h2>
            </div>
            <p>{copy.casesText[language]}</p>
          </div>
        )}
        <div className="case-grid">
          {caseCards.map((item) => (
            <article className="case-card-motion" key={item.src}>
              <Link className="case-card" href={item.href![language]}>
                <div className="template-card-media">
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 760px) 100vw, 33vw" />
                </div>
                <div>
                  <span>{templateCopy.common.caseLabel[language]}</span>
                  <h3>{item.title[language]}</h3>
                  <UiIcon name="arrow-right" className="case-card-arrow" size={20} />
                </div>
              </Link>
            </article>
          ))}
        </div>
        {showLink && <Link className="text-link landing-cases-link" href={caseHref}>{copy.allCases[language]} <UiIcon name="arrow-right" size={18} /></Link>}
      </div>
    </section>
  );
}
