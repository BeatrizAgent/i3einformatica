import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";

export const SESSION_COOKIE = "i3e_session";
const SESSION_SECONDS = 8 * 60 * 60;
const roleRank = { reviewer: 1, editor: 2, admin: 3 } as const;
export type UserRole = keyof typeof roleRank;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function hashOptional(value: string | null) {
  if (!value) return null;
  const pepper = process.env.SESSION_SECRET;
  if (!pepper) return null;
  return createHash("sha256").update(`${pepper}:${value}`).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const requestHeaders = await headers();
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);
  await getDb().insert(sessions).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
    ipHash: hashOptional(requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() ?? null),
    userAgent: requestHeaders.get("user-agent")?.slice(0, 1000),
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [row] = await getDb()
    .select({
      sessionId: sessions.id,
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        gt(sessions.expiresAt, new Date()),
        isNull(sessions.revokedAt),
        eq(users.active, true),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function requireRole(minimum: UserRole) {
  const user = await getCurrentUser();
  if (!user || roleRank[user.role] < roleRank[minimum]) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function revokeCurrentSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await getDb()
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.tokenHash, hashToken(token)));
  }
  store.delete(SESSION_COOKIE);
}
