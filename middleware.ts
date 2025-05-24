import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/express-shop",
    "/meal-plans",
    "/meals",
    "/how-it-works",
    "/about",
    "/contact",
    "/blog",
    "/terms",
    "/privacy",
    "/careers",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/session",
    "/api/auth/logout",
    "/api/products",
    "/api/cart",
    "/api/cart/add",
    "/api/cart/remove",
    "/api/cart/update",
    "/api/cart/count",
    "/api/cart-debug-actions",
    "/api/health",
    "/api/test",
    "/api/create-admin",
    "/api/debug-login",
    "/api/fix-sessions-table",
    "/debug-login-test",
    "/api/init-db",
    "/api/seed-products",
  ]

  // API routes that start with these patterns are public
  const publicApiPatterns = ["/api/products/", "/api/express-shop/", "/api/meals/", "/api/meal-plans/"]

  // Check if route is public
  const isPublicRoute =
    publicRoutes.includes(pathname) || publicApiPatterns.some((pattern) => pathname.startsWith(pattern))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for session
  const sessionToken = request.cookies.get("session-token")?.value

  if (!sessionToken) {
    // Redirect to login for protected routes
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
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
