import { NextResponse } from "next/server"

// For v0 preview, we'll simulate being logged in
export async function GET() {
  return NextResponse.json({
    isAuthenticated: true,
    user: {
      id: "1",
      name: "Demo User",
      email: "user@example.com",
      role: "user",
    },
  })
}
