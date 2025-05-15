import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware that doesn't block any routes
export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only match specific paths that need middleware
    "/dashboard/:path*",
    "/checkout/:path*",
    "/api/auth/:path*",
  ],
}
