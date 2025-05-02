import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt } from "./lib/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path.startsWith("/api/auth") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon") ||
    path.startsWith("/images") ||
    path.startsWith("/public") ||
    path.startsWith("/meals") ||
    path.startsWith("/meal-plans") ||
    path.startsWith("/how-it-works") ||
    path.startsWith("/order")

  // Get the session cookie
  const sessionCookie = request.cookies.get("session")?.value

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If there's no session and the path requires auth, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, request.url))
  }

  try {
    // Verify the session
    const session = await decrypt(sessionCookie)

    // If session is invalid, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, request.url))
    }

    // Session is valid, continue
    return NextResponse.next()
  } catch (error) {
    // If session verification fails, redirect to login
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
