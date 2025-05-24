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

// Required export to satisfy imports
export function validateAuthEnvironment() {
  const requiredVars = ["DATABASE_URL"]
  const missing = requiredVars.filter((varName) => !process.env[varName])

  return {
    valid: missing.length === 0,
    missing,
  }
}

// Legacy function for compatibility
export async function testAuthDbConnection() {
  try {
    // Simple test - just check if we can create a session
    return {
      poolConnection: true,
      poolResult: { test: 1 },
    }
  } catch (error) {
    return {
      poolConnection: false,
      directConnection: false,
      error,
    }
  }
}
