export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  personalization: boolean;
};

export const STORAGE_KEY = "i3e-cookie-consent";

export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as CookiePreferences;
  } catch {
    return null;
  }
}

export function saveCookieConsent(prefs: CookiePreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new CustomEvent("i3e-cookie-consent-change", { detail: prefs }));
}

export function reopenCookieConsent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("i3e-cookie-consent-reopen"));
}
