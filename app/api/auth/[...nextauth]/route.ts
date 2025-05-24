import { NextResponse } from "next/server"

// Minimal stub to satisfy imports - redirects to our custom auth
export const authOptions = {
  providers: [],
  callbacks: {},
}

// Redirect all NextAuth requests to our custom auth
export async function GET() {
  return NextResponse.redirect(new URL("/login", "http://localhost:3000"))
}

export async function POST() {
  return NextResponse.redirect(new URL("/login", "http://localhost:3000"))
}
