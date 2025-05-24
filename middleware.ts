import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session-id")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/how-it-works",
    "/meal-plans",
    "/meals",
    "/express-shop",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/session",
    "/api/products",
    "/api/health",
    "/api/create-admin",
    "/api/debug-login",
  ]

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.includes("[") || route.includes("*")) {
      // Handle dynamic routes
      const routePattern = route.replace(/\[.*?\]/g, "[^/]+")
      const regex = new RegExp(`^${routePattern}`)
      return regex.test(pathname)
    }
    return pathname === route || pathname.startsWith(route + "/")
  })

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For protected routes, check if user has a session
  if (!sessionId) {
    // Redirect to login if no session
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If session exists, continue to the route
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
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
