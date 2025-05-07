import { USERS } from "@/lib/auth-simple"

// Find user by email (simulating database lookup)
export function findUserByEmail(email: string) {
  return USERS.find((user) => user.email === email) || null
}
