import "server-only";

import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";

const flowSchema = z.object({
  verifier: z.string().min(32),
  state: z.string().min(16),
  nonce: z.string().min(16),
  returnTo: z.string().startsWith("/"),
});

export type OidcFlow = z.infer<typeof flowSchema>;

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters");
  return new TextEncoder().encode(secret);
}

export function sealOidcFlow(flow: OidcFlow) {
  return new SignJWT(flow)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .setAudience("i3e-oidc-callback")
    .sign(getKey());
}

export async function openOidcFlow(token: string) {
  const { payload } = await jwtVerify(token, getKey(), { audience: "i3e-oidc-callback" });
  return flowSchema.parse(payload);
}
