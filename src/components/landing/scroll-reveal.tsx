"use client";

import type { ReactNode } from "react";
import * as m from "motion/react-m";
import { useLandingMotionEnabled, useNativeScrollReveal } from "@/components/landing/motion-provider";

const ease = [0.22, 1, 0.36, 1] as const;

const revealVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, ease, delay },
  }),
};

const staggerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  enabled?: boolean;
};

type RevealItemProps = RevealProps & {
  as?: "div" | "article" | "li";
};

const viewport = { once: true, amount: 0.16, margin: "0px 0px -10% 0px" };

export function ScrollReveal({ children, className, delay = 0, enabled = true }: RevealProps) {
  const allowMotion = useLandingMotionEnabled();
  const nativeScroll = useNativeScrollReveal();
  if (!enabled || !allowMotion) return <div className={className}>{children}</div>;
  if (nativeScroll) return <div className={`${className ?? ""} scroll-reveal-native`} data-motion-reveal="true">{children}</div>;
  return (
    <m.div
      className={className}
      data-motion-reveal="true"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={revealVariants}
      custom={delay}
    >
      {children}
    </m.div>
  );
}

export function MotionStagger({ children, className, enabled = true }: RevealProps) {
  const allowMotion = useLandingMotionEnabled();
  if (!enabled || !allowMotion) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      data-motion-stagger="true"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerVariants}
    >
      {children}
    </m.div>
  );
}

export function MotionRevealItem({ children, className, as = "div", enabled = true }: RevealItemProps) {
  const allowMotion = useLandingMotionEnabled();
  if (!enabled || !allowMotion) {
    if (as === "article") return <article className={className}>{children}</article>;
    if (as === "li") return <li className={className}>{children}</li>;
    return <div className={className}>{children}</div>;
  }
  const props = {
    className,
    "data-motion-item": "true",
    variants: revealVariants,
    custom: 0,
  };

  if (as === "article") return <m.article {...props}>{children}</m.article>;
  if (as === "li") return <m.li {...props}>{children}</m.li>;
  return <m.div {...props}>{children}</m.div>;
}
