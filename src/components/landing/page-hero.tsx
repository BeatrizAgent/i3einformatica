import Image from "next/image";
import Link from "next/link";
import type { SiteVisual } from "@/lib/site-assets";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  visual?: SiteVisual;
  cta: { href: string; label: string };
};

export function PageHero({ eyebrow, title, intro, visual, cta }: PageHeroProps) {
  return (
    <section className={`hero ${visual ? "hero-with-visual" : ""} page-hero`}>
      <div className="hero-orb" aria-hidden="true" />
      {visual && (
        <div className="hero-visual page-hero-visual">
          <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 900px) 90vw, 48vw" priority />
        </div>
      )}
      <div className="shell hero-content">
        <p className="eyebrow page-hero-eyebrow">{eyebrow}</p>
        <h1 className="page-hero-title">{title}</h1>
        <p className="lead page-hero-intro">{intro}</p>
        <div className="hero-actions page-hero-actions">
          <Link className="button" href={cta.href}>{cta.label}</Link>
        </div>
      </div>
    </section>
  );
}
