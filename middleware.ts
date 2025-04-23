import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/auth-test")

  // During debugging, allow access to test routes
  if (path.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect logic
  if (isPublicPath && token) {
    // If the user is authenticated and trying to access a public path,
    // redirect them to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isPublicPath && !token) {
    // If the user is not authenticated and trying to access a protected path,
    // redirect them to the login page
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    // Apply to all paths except static files, api routes that aren't auth-related, etc.
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
