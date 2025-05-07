import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { siteConfig } from "./constants"

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
  // Get email and password from form data
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate input
  if (!email || !password) {
    return { success: false, message: "Email and password are required" }
  }

  try {
    // Make API request to login endpoint
    const response = await fetch(`${siteConfig.apiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, message: data.message || "Login failed" }
    }

    // Create session
    const session = {
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      },
    }

    // Create token
    const token = await encrypt(session)

    // Save token in cookies
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return { success: true, session }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

export async function logout() {
  // Clear token cookie
  cookies().set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  })
}

export async function getSession() {
  const token = cookies().get("token")?.value

  if (!token) {
    return null
  }

  const payload = await decrypt(token)

  if (!payload) {
    return null
  }

  return payload.user
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get("token")?.value

  if (!token) {
    return null
  }

  const payload = await decrypt(token)

  if (!payload) {
    return null
  }

  // Refresh token
  const session = { user: payload.user }
  const newToken = await encrypt(session)

  // Update token in cookies
  const response = NextResponse.next()
  response.cookies.set({
    name: "token",
    value: newToken,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
  })

  return response
}
