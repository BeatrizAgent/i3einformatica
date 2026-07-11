import type { Locale } from "@/db/schema";

import { defaultLocale, isLocale } from "./config";

export type LocalizedRoute = {
  locale: Locale;
  localizedPath: string;
  pathname: string;
};

export function normalizePath(path: string): string {
  const withoutQuery = path.split(/[?#]/, 1)[0] ?? "/";
  const withLeadingSlash = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");
  if (collapsed === "/") return collapsed;
  return collapsed.replace(/\/$/, "");
}

export function parseLocalizedPath(pathname: string): LocalizedRoute {
  const normalized = normalizePath(pathname);
  const segments = normalized.split("/").filter(Boolean);
  const candidate = segments[0];
  const locale = candidate && isLocale(candidate) && candidate !== defaultLocale ? candidate : defaultLocale;
  const contentSegments = locale === defaultLocale ? segments : segments.slice(1);
  const localizedPath = normalizePath(`/${contentSegments.join("/")}`);

  return { locale, localizedPath, pathname: normalized };
}

export function buildLocalizedPath(locale: Locale, localizedPath: string): string {
  const normalized = normalizePath(localizedPath);
  if (locale === defaultLocale) return normalized;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}
