import { locales, type Locale } from "@/db/schema";

export const defaultLocale: Locale = "es";
export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale);

export const localeNames: Record<Locale, string> = {
  es: "Español",
  ca: "Català",
  eu: "Euskara",
  gl: "Galego",
  pt: "Português",
  en: "English",
  fr: "Français",
  de: "Deutsch",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
