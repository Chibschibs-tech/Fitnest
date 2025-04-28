import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // We'll let the client-side auth handling take care of most of the protection
  // This middleware will only handle a few specific cases

  // Get the pathname
  const path = request.nextUrl.pathname

  // Allow all API routes to pass through
  if (path.startsWith("/api")) {
    return NextResponse.next()
  }

  // Allow access to static files and images
  if (
    path.startsWith("/_next") ||
    path.startsWith("/favicon") ||
    path.startsWith("/images") ||
    path.startsWith("/public")
  ) {
    return NextResponse.next()
  }

  // For all other routes, we'll let the client-side auth handling take care of it
  return NextResponse.next()
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
