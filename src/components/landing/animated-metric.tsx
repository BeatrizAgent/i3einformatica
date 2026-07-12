"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedMetricProps = {
  value: string;
  label?: string;
};

function parseMetric(value: string) {
  const match = value.trim().match(/^(\D*)([\d.,]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: value };

  const target = Number(match[2].replace(/[.,]/g, ""));
  return {
    prefix: match[1],
    target: Number.isFinite(target) ? target : 0,
    suffix: match[3],
  };
}

export function AnimatedMetric({ value, label }: AnimatedMetricProps) {
  const metric = parseMetric(value);
  const [current, setCurrent] = useState(0);
  const metricRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = metricRef.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let started = false;

    const animate = () => {
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setCurrent(Math.round(metric.target * eased));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      frame = window.requestAnimationFrame(() => setCurrent(metric.target));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        animate();
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [metric.target]);

  return (
    <span ref={metricRef} aria-label={`${value}${label ? ` ${label}` : ""}`} suppressHydrationWarning>
      {metric.prefix}{current}{metric.suffix}
    </span>
  );
}
