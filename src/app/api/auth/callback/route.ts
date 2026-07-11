import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { openOidcFlow } from "@/lib/auth/flow";
import { getOidcConfiguration, getOidcRedirectUri, oidc } from "@/lib/auth/oidc";
import { createSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const flowToken = request.cookies.get("i3e_oidc_flow")?.value;
  if (!flowToken) return NextResponse.json({ error: "Missing OIDC flow" }, { status: 400 });
  try {
    const flow = await openOidcFlow(flowToken);
    const config = await getOidcConfiguration();
    const tokens = await oidc.authorizationCodeGrant(config, request, {
      pkceCodeVerifier: flow.verifier,
      expectedState: flow.state,
      expectedNonce: flow.nonce,
      idTokenExpected: true,
    }, { redirect_uri: getOidcRedirectUri() });
    const claims = tokens.claims();
    const subject = claims?.sub;
    const email = typeof claims?.email === "string" ? claims.email.toLowerCase() : undefined;
    if (!subject || !email || claims?.email_verified !== true) throw new Error("OIDC provider did not return a verified email");
    const allowed = (process.env.OIDC_ALLOWED_EMAILS ?? "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.length === 0) {
      return NextResponse.json({ error: "OIDC allowlist is not configured" }, { status: 503 });
    }
    if (!allowed.includes(email)) {
      return NextResponse.json({ error: "Account is not allowed" }, { status: 403 });
    }
    const displayName = typeof claims?.name === "string" ? claims.name : null;
    const [user] = await getDb()
      .insert(users)
      .values({ oidcSubject: subject, email, displayName, lastLoginAt: new Date() })
      .onConflictDoUpdate({
        target: users.oidcSubject,
        set: { email, displayName, lastLoginAt: new Date(), updatedAt: new Date() },
      })
      .returning({ id: users.id });
    await createSession(user.id);
    const response = NextResponse.redirect(new URL(flow.returnTo, request.url));
    response.cookies.delete("i3e_oidc_flow");
    return response;
  } catch {
    return NextResponse.json({ error: "OIDC callback validation failed" }, { status: 400 });
  }
}
