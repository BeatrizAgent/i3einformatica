"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ParallaxMedia({ children }: { children: ReactNode }) {
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = mediaRef.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distance = (bounds.top + bounds.height / 2 - viewportCenter) / window.innerHeight;
      const offset = Math.max(-14, Math.min(14, distance * -22));
      node.style.setProperty("--parallax-y", `${offset}px`);
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={mediaRef} className="parallax-media-shell" data-parallax-media>
      <div className="parallax-media-image">{children}</div>
    </div>
  );
}
