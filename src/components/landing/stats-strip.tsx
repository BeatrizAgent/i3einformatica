import { MotionRevealItem, MotionStagger } from "@/components/landing/scroll-reveal";
import { AnimatedMetric } from "@/components/landing/animated-metric";
import type { Locale } from "@/lib/content/repository";
import { templateCopy } from "@/lib/page-template-data";

export function StatsStrip({ locale, ariaLabel }: { locale: Locale; ariaLabel?: string }) {
  const language = locale === "en" ? "en" : "es";
  const copy = templateCopy.home;
  return (
    <section className="stats-strip" aria-label={ariaLabel ?? (language === "es" ? "Datos de i3e" : "i3e at a glance")}>
      <MotionStagger className="shell stats-grid" enabled>
        {copy.stats[language].map((stat) => (
          <MotionRevealItem as="div" className="stat" key={stat.label} enabled>
            <strong><AnimatedMetric value={stat.value} label={stat.label} /></strong>
            <span>{stat.label}</span>
          </MotionRevealItem>
        ))}
      </MotionStagger>
    </section>
  );
}
