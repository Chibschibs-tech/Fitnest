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
  const action = url.searchParams.get("action") || url.pathname.split("/").pop()

  switch (action) {
    case "signin":
      return NextResponse.redirect(new URL("/login", request.url))
    case "signout":
      return NextResponse.redirect(new URL("/api/auth/logout", request.url))
    case "session":
      return NextResponse.redirect(new URL("/api/auth/session", request.url))
    default:
      return NextResponse.redirect(new URL("/login", request.url))
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL("/api/auth/login", request.url))
}
