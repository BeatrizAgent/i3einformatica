"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroNetwork, type HeroLocale } from "@/components/landing/hero-network";
import { generatedLandingVisuals } from "@/lib/site-assets";

gsap.registerPlugin(ScrollTrigger);

type HeroSceneProps = {
  eyebrow: string;
  title: string;
  intro: string;
  locale: HeroLocale;
  cta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
};

export function HeroScene({ eyebrow, title, intro, locale, cta, secondaryCta }: HeroSceneProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });

      entrance
        .from(".hero-scene-eyebrow", { opacity: 0, y: 10, duration: 0.28 })
        .from(".hero-scene-title", { opacity: 0, y: 20, duration: 0.5 }, "-=0.12")
        .from(".hero-scene-intro", { opacity: 0, y: 14, duration: 0.42 }, "-=0.2")
        .from(".hero-scene-actions", { opacity: 0, y: 12, duration: 0.36 }, "-=0.16")
        .from(".hero-network", { opacity: 0, x: 22, duration: 0.52 }, "-=0.1")
        .from(".hero-network-node", { opacity: 0, scale: 0.88, duration: 0.32, stagger: 0.06 }, "-=0.3");
    });

    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to(".hero-network", {
        y: -16,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(".hero-scene-grid", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => media.revert();
  }, { scope: root });

  return (
    <section ref={root} className="hero hero-home hero-with-network hero-scene">
      <div className="hero-scene-art" aria-hidden="true">
        <Image src={generatedLandingVisuals.hero.src} alt="" fill priority sizes="(max-width: 900px) 100vw, 65vw" />
      </div>
      <div className="shell hero-content">
        <p className="eyebrow hero-scene-eyebrow">{eyebrow}</p>
        <h1 className="hero-scene-title">{title}</h1>
        <p className="lead hero-scene-intro">{intro}</p>
        <div className="hero-actions hero-scene-actions">
          <Link className="button" href={cta.href}>{cta.label}</Link>
          <Link className="text-link" href={secondaryCta.href}>{secondaryCta.label} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <HeroNetwork locale={locale} />
    </section>
  );
}
