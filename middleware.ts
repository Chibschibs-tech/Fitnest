import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Completely disable middleware to ensure all pages are accessible
export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  return NextResponse.next()
}

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
