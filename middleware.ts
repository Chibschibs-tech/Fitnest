import { type NextRequest, NextResponse } from "next/server"

// Temporarily disable authentication checks to allow login/signup
export function middleware(request: NextRequest) {
  // Allow all requests to pass through for now
  return NextResponse.next()
}
