import { type NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/simple-auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes that don't need auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/test") ||
    pathname.startsWith("/api/init") ||
    pathname.startsWith("/api/seed") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Protected routes
  const protectedRoutes = ["/dashboard", "/admin", "/orders"]
  const adminRoutes = ["/admin"]

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const sessionId = request.cookies.get("session-id")?.value

    if (!sessionId) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const user = await getSessionUser(sessionId)

      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      if (isAdminRoute && user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      console.error("Middleware auth error:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
