import { NextResponse, type NextRequest } from "next/server";
import { revokeCurrentSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  await revokeCurrentSession();
  return NextResponse.redirect(new URL("/", request.url), 303);
}
