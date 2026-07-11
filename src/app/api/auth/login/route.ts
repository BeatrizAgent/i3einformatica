import { NextResponse, type NextRequest } from "next/server";
import { getOidcConfiguration, getOidcRedirectUri, oidc } from "@/lib/auth/oidc";
import { sealOidcFlow } from "@/lib/auth/flow";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const issuer = process.env.OIDC_ISSUER_URL;
  const clientId = process.env.OIDC_CLIENT_ID;

  // Direct bypass in development if OIDC is not configured or uses a dummy issuer
  if (isDev && (!issuer || issuer.includes("dummy") || !clientId)) {
    console.log("Dev mode: OIDC is not configured or uses dummy settings. Activating dev login bypass directly.");
    const db = getDb();
    const email = process.env.SEED_ADMIN_EMAIL || "admin@i3einformatica.com";
    const [adminUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (adminUser) {
      await createSession(adminUser.id);
      const rawReturnTo = request.nextUrl.searchParams.get("returnTo") ?? "/admin";
      const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/admin";
      return NextResponse.redirect(new URL(returnTo, request.url));
    } else {
      console.error("Dev bypass: seed admin user not found in database. Run pnpm db:seed first.");
      return NextResponse.json({ error: "Seed admin user not found. Run db:seed." }, { status: 500 });
    }
  }

  try {
    const config = await getOidcConfiguration();
    const verifier = oidc.randomPKCECodeVerifier();
    const state = oidc.randomState();
    const nonce = oidc.randomNonce();
    const challenge = await oidc.calculatePKCECodeChallenge(verifier);
    const rawReturnTo = request.nextUrl.searchParams.get("returnTo") ?? "/admin";
    const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/admin";
    const authorizationUrl = oidc.buildAuthorizationUrl(config, {
      redirect_uri: getOidcRedirectUri(),
      scope: "openid email profile",
      code_challenge: challenge,
      code_challenge_method: "S256",
      state,
      nonce,
    });
    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set("i3e_oidc_flow", await sealOidcFlow({ verifier, state, nonce, returnTo }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/callback",
      maxAge: 600,
    });
    return response;
  } catch (error) {
    if (isDev) {
      console.warn("OIDC configuration/discovery failed. Using dev login bypass...", error);
      const db = getDb();
      const email = process.env.SEED_ADMIN_EMAIL || "admin@i3einformatica.com";
      const [adminUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (adminUser) {
        await createSession(adminUser.id);
        const rawReturnTo = request.nextUrl.searchParams.get("returnTo") ?? "/admin";
        const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/admin";
        return NextResponse.redirect(new URL(returnTo, request.url));
      } else {
        console.error("Dev bypass: seed admin user not found in database. Run pnpm db:seed first.");
      }
    }
    return NextResponse.json({ error: "OIDC is not configured" }, { status: 503 });
  }
}
