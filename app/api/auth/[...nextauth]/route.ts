import { NextResponse } from "next/server"

// Add the missing export
export const authOptions = {
  providers: [],
  callbacks: {},
}

// Redirect all NextAuth requests to our custom auth
export async function GET() {
  return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"))
}

export async function POST() {
  return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"))
}

// This is a minimal stub to satisfy imports
// The actual authentication is handled by our custom auth system
export const handlers = {
  GET: async () => new Response(JSON.stringify({ status: "ok" })),
  POST: async () => new Response(JSON.stringify({ status: "ok" })),
}

export const auth = async () => null
