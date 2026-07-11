import { NextResponse, type NextRequest } from "next/server";

const localized = new Set(["ca", "eu", "gl", "pt", "en", "fr", "de"]);
const defaultLocale = "es";

/**
 * Injects the negotiated locale into the request headers so that the root
 * layout can render the correct `lang` attribute and locale-dependent metadata.
 *
 * Next.js 16 renamed the previous `middleware` convention to `proxy`. The
 * behaviour is unchanged: this runs before the request is completed and can
 * rewrite, redirect, or modify request/response headers.
 */
export function proxy(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split("/").filter(Boolean)[0];
  const locale = firstSegment && localized.has(firstSegment) ? firstSegment : defaultLocale;

  const headers = new Headers(request.headers);
  headers.set("x-i3e-locale", locale);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
