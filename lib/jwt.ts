/**
 * JWT stub implementation using simple session management
 */

import { cookies } from "next/headers"

// Simple encrypt function (not actual JWT)
export function encrypt(payload: any): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

// Simple decrypt function (not actual JWT)
export function decrypt(token: string): any {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
  } catch (error) {
    return null
  }
}

// Simple verify function
export function verify(token: string): boolean {
  try {
    const payload = decrypt(token)
    return !!payload && typeof payload === "object"
  } catch (error) {
    return false
  }
}

// Get session from cookies
export function getSession() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    return decrypt(sessionCookie.value)
  } catch (error) {
    return null
  }
}

// Login function
export async function login(credentials: { email: string; password: string }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  return response.json()
}

// Logout function
export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
  })
}

export default {
  encrypt,
  decrypt,
  verify,
  getSession,
  login,
  logout,
}
