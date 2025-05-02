import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

const secretKey = process.env.JWT_SECRET || "fallback-secret-key-change-in-production"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function login(formData: FormData) {
  // Get email and password from form
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Here you would validate against your database
  // For example:
  const { neon } = require("@neondatabase/serverless")
  const sql = neon(process.env.DATABASE_URL || "")
  const bcrypt = require("bcryptjs")

  try {
    const users = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`

    if (!users || users.length === 0) {
      return { success: false, message: "Invalid credentials" }
    }

    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return { success: false, message: "Invalid credentials" }
    }

    // Create session
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    }

    // Create and set the cookie
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const token = await encrypt(session)

    cookies().set("session", token, {
      expires,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return { success: true, session }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

export async function logout() {
  cookies().set("session", "", {
    expires: new Date(0),
    path: "/",
  })
}

export async function getSession() {
  const session = cookies().get("session")?.value

  if (!session) return null

  return await decrypt(session)
}

export function updateSession(request: NextRequest) {
  // Get the session cookie
  const sessionCookie = request.cookies.get("session")?.value

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Validate the session (you can add more validation here)
  try {
    // Verify and decrypt the session cookie
    const session = decrypt(sessionCookie)

    // If session is valid, continue
    return NextResponse.next()
  } catch (error) {
    // If session is invalid, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
