import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    // Skip middleware for API routes to prevent auth issues
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.next()
    }

    const token = await getToken({ req: request })
    const isAuthenticated = !!token

    // Admin routes protection
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    // Dashboard routes protection
    if (request.nextUrl.pathname.startsWith("/dashboard") && !isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Redirect authenticated users away from auth pages
    if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error, allow the request to continue
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
}
