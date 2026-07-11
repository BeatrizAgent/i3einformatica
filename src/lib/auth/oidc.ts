import "server-only";

import * as oidc from "openid-client";

let configuration: Promise<oidc.Configuration> | undefined;

export function getOidcConfiguration() {
  const issuer = process.env.OIDC_ISSUER_URL;
  const clientId = process.env.OIDC_CLIENT_ID;
  if (!issuer || !clientId) throw new Error("OIDC is not configured");
  configuration ??= oidc.discovery(
    new URL(issuer),
    clientId,
    process.env.OIDC_CLIENT_SECRET,
  );
  return configuration;
}

export function getOidcRedirectUri() {
  return new URL(
    "/api/auth/callback",
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ).toString();
}

export { oidc };
