// app/api/auth/signout/route.ts
import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/base-url";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export const prerender = false;

export async function GET() {
  // exemple minimal de signout sans NextAuth (si tu utilises NextAuth, garde sa logique ici)
  const res = NextResponse.redirect(new URL("/", getBaseUrl()));
  res.cookies.set("session", "", { expires: new Date(0), httpOnly: true, path: "/" });
  return res;
}
