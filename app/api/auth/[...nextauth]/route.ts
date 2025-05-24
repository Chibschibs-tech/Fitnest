// Stub file to satisfy imports - redirects to custom auth
import { type NextRequest, NextResponse } from "next/server"

// Minimal authOptions export to satisfy imports
export const authOptions = {
  providers: [],
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  callbacks: {
    redirect: () => "/dashboard",
  },
}

// Redirect all NextAuth requests to our custom auth
export async function GET(request: NextRequest) {
  const url = new URL(request.url)

  if (url.pathname.includes("signin")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (url.pathname.includes("signout")) {
    return NextResponse.redirect(new URL("/api/auth/logout", request.url))
  }

  if (url.pathname.includes("session")) {
    return NextResponse.redirect(new URL("/api/auth/session", request.url))
  }

  return NextResponse.redirect(new URL("/login", request.url))
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL("/api/auth/login", request.url))
}
