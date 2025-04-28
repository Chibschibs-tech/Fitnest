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
    path === "/meal-plans" ||
    path === "/meals" ||
    path === "/order" || // Make order page public
    path === "/how-it-works" ||
    path === "/about" ||
    path === "/contact" ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/auth-test") ||
    path.startsWith("/api/test-auth") ||
    path.startsWith("/api/test-db") ||
    path.startsWith("/api/health") ||
    path.startsWith("/api/auth-health") ||
    path.startsWith("/api/meals")

  // Allow access to static files and images
  if (
    path.startsWith("/_next") ||
    path.startsWith("/favicon") ||
    path.startsWith("/images") ||
    path.startsWith("/public")
  ) {
    return NextResponse.next()
  }

  try {
    // Get the token with proper error handling
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    }).catch((err) => {
      console.error("Token error in middleware:", err)
      return null
    })

    // If trying to access a protected route without being logged in
    if (!isPublicPath && !token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }

    // If trying to access login/register while already logged in
    if ((path === "/login" || path === "/register") && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Continue with the request for all other cases
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error in the middleware, allow the request to continue
    return NextResponse.next()
  }
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
