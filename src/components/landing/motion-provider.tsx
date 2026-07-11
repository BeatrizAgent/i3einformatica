"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";

const LandingMotionContext = createContext(true);
const NativeScrollRevealContext = createContext(false);
const reduceMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(callback: () => void) {
  const media = window.matchMedia(reduceMotionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getMotionPreference() {
  return window.matchMedia(reduceMotionQuery).matches;
}

function subscribeToScrollSupport() {
  return () => {};
}

function getScrollSupport() {
  return (
    typeof window !== "undefined" &&
    CSS.supports("(animation-timeline: view()) and (animation-range: entry)")
  );
}

export function useLandingMotionEnabled() {
  return useContext(LandingMotionContext);
}

export function useNativeScrollReveal() {
  return useContext(NativeScrollRevealContext);
}

export function LandingMotionProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, () => false);
  const nativeScrollReveal = useSyncExternalStore(subscribeToScrollSupport, getScrollSupport, () => false);

  return (
    <LazyMotion strict features={domAnimation}>
      <MotionConfig reducedMotion="never">
        <LandingMotionContext.Provider value={!reduceMotion}>
          <NativeScrollRevealContext.Provider value={nativeScrollReveal}>{children}</NativeScrollRevealContext.Provider>
        </LandingMotionContext.Provider>
      </MotionConfig>
    </LazyMotion>
  );
}
