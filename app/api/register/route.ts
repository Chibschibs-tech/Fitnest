import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { db, users } from "@/lib/db"
import { eq } from "drizzle-orm"
import { SignJWT } from "jose"

// JWT secret key
const secretKey = process.env.JWT_SECRET || "fallback-secret-key-change-in-production"
const key = new TextEncoder().encode(secretKey)

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create user
    const result = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "customer",
      })
      .returning({ id: users.id, name: users.name, email: users.email, role: users.role })

    const newUser = result[0]

    // Create session
    const session = {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    }

    // Create token
    const token = await new SignJWT(session)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(key)

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: newUser,
      },
      { status: 201 },
    )

    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
