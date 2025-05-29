import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to waitlist page and its API without authentication
  if (pathname === "/waitlist" || pathname === "/api/waitlist" || pathname === "/api/waitlist-email") {
    return NextResponse.next()
  }

  // Allow access to public pages
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/api/auth",
    "/api/test",
    "/api/health",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/how-it-works",
    "/meal-plans",
    "/meals",
    "/express-shop",
    "/blog",
    "/faq",
  ]

  // Check if the path is public or starts with a public path
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`) || pathname.startsWith("/api/auth/"),
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  // For protected routes, check authentication
  const sessionId = request.cookies.get("session-id")?.value

  if (!sessionId) {
    // Redirect to login with the current path as callback
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}
