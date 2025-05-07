import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

// JWT secret key
const secretKey = process.env.JWT_SECRET || "fallback-secret-key-change-in-production"
const key = new TextEncoder().encode(secretKey)

export async function GET() {
  try {
    const token = cookies().get("token")?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    try {
      const { payload } = await jwtVerify(token, key, {
        algorithms: ["HS256"],
      })

      if (!payload || !payload.user) {
        return NextResponse.json({ user: null }, { status: 200 })
      }

      return NextResponse.json({ user: payload.user }, { status: 200 })
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ user: null }, { status: 200 })
    }
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ message: "An error occurred fetching the session." }, { status: 500 })
  }
}
