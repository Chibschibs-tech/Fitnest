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
    "/api/health",
    "/api/init-db",
    "/api/seed-products",
    "/api/create-admin",
    "/api/fix-sessions-table",
    "/api/debug-login",
    "/api/check-cart-structure",
    "/api/cart-debug-actions",
    "/api/cart-simple-test",
    "/debug-login-test",
  ]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For protected routes, check authentication
  const sessionCookie = request.cookies.get("session")

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)"],
}
