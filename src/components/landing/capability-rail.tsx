"use client";

import Image from "next/image";
import Link from "next/link";
import * as m from "motion/react-m";
import { useLandingMotionEnabled } from "@/components/landing/motion-provider";
import type { Locale } from "@/lib/content/repository";
import type { Capability } from "@/lib/site-assets";

const ease = [0.22, 1, 0.36, 1] as const;

export function CapabilityRail({ items, locale, enabled = true }: { items: Capability[]; locale: Locale; enabled?: boolean }) {
  const allowMotion = useLandingMotionEnabled();
  const active = enabled && allowMotion;
  const language = locale === "en" ? "en" : "es";

  return (
    <div className="capability-rail" aria-label={language === "es" ? "Capacidades" : "Capabilities"}>
      {items.map((item, index) => (
        <m.div
          className="capability-item"
          key={item.src}
          data-motion-capability={active ? "true" : undefined}
          initial={active ? { opacity: 0, y: 14 } : false}
          whileInView={active ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: active ? 0.38 : 0, delay: active ? index * 0.06 : 0, ease }}
          whileHover={active ? { y: -2 } : undefined}
        >
          <Link className="capability-card" href={item.href[language]}>
            <Image src={item.src} alt="" width={48} height={48} />
            <span>{item.label[language]}</span>
            <span className="capability-arrow" aria-hidden="true">↗</span>
          </Link>
        </m.div>
      ))}
    </div>
  );
}
