import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value

    if (!sessionId) {
      return null
    }

    const user = await getSessionUser(sessionId)
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "admin") {
    throw new Error("Admin access required")
  }
  return user
}

export function validateAuthEnvironment() {
  const requiredVars = ["DATABASE_URL", "NEXTAUTH_SECRET"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  return {
    valid: missing.length === 0,
    missing,
  }
}
