import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico
     */
    "/((?!_next|static|favicon.ico).*)",
  ],
}

export const publicRoutes = ["/", "/login", "/new-verification", "/new-password", "/api/fix-sessions-table"]
