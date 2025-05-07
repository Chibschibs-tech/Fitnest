import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// Hard-coded users for demonstration (in a real app, you'd use a database)
// This is a radical solution to avoid database issues
export const USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@fitnest.ma",
    // Password: admin123
    hashedPassword: "$2a$12$k8Y1.5S2YRFEsXmhRVT/8.0Jx9M0RMKbmm4/GjdgxEjXyVqZki2cq",
    role: "admin",
  },
  {
    id: "2",
    name: "Test User",
    email: "user@fitnest.ma",
    // Password: user123
    hashedPassword: "$2a$12$k0zsfLmJ8cUEYJMjZ/Obre3QmDFdcqZQvzAHxQULhJHYt0q8wYyRW",
    role: "customer",
  },
]

const secretKey = process.env.JWT_SECRET || "fallback-secret-key-change-in-production"
const key = new TextEncoder().encode(secretKey)

// Find user by email (simulating database lookup)
export function findUserByEmail(email: string) {
  return USERS.find((user) => user.email === email) || null
}

// Create a new user (in a real app, this would save to a database)
export function createUser(userData: { name: string; email: string; hashedPassword: string }) {
  // In a real implementation, this would add to the database
  // For this simplified version, we just return a success message
  return {
    id: `temp-${Date.now()}`,
    ...userData,
    role: "customer",
  }
}

// Generate JWT token
export async function generateToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

// Verify JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

// Set auth cookie
export function setAuthCookie(token: string) {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
  })
}

// Get auth cookie
export function getAuthCookie() {
  return cookies().get("auth_token")?.value
}

// Clear auth cookie
export function clearAuthCookie() {
  cookies().set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  })
}

// Get current user from token
export async function getCurrentUser() {
  const token = getAuthCookie()

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)

  if (!payload || !payload.id) {
    return null
  }

  // In a real app, you'd fetch the user from the database
  // For this simplified version, we find the user in our hard-coded array
  const user = USERS.find((u) => u.id === payload.id)

  if (!user) {
    return null
  }

  // Don't return the hashed password
  const { hashedPassword, ...userWithoutPassword } = user
  return userWithoutPassword
}
