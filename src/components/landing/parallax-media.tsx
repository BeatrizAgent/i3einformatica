import type { ReactNode } from "react";

export function ParallaxMedia({ children }: { children: ReactNode }) {
  return (
    <div className="parallax-media-shell">
      <div className="parallax-media-image">{children}</div>
    </div>
  );
}
