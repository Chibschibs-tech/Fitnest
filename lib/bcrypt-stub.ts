// Stub implementation of bcrypt using Node.js crypto
import crypto from "crypto"

// Simple hash function using built-in crypto only
export function hash(data: string, saltOrRounds: string | number): Promise<string> {
  const salt = typeof saltOrRounds === "string" ? saltOrRounds : crypto.randomBytes(16).toString("hex")

  const hash = crypto
    .createHash("sha256")
    .update(data + salt + "fitnest-salt-2024")
    .digest("hex")

  return Promise.resolve(`$2b$10$${salt}$${hash}`)
}

// Simple compare function
export function compare(data: string, encrypted: string): Promise<boolean> {
  try {
    const parts = encrypted.split("$")
    if (parts.length < 4) return Promise.resolve(false)

    const salt = parts[3]
    const newHash = crypto
      .createHash("sha256")
      .update(data + salt + "fitnest-salt-2024")
      .digest("hex")

    const expectedFormat = `$2b$10$${salt}$${newHash}`
    return Promise.resolve(expectedFormat === encrypted)
  } catch (error) {
    return Promise.resolve(false)
  }
}

// Other bcrypt functions that might be imported
export function genSalt(rounds: number): Promise<string> {
  return Promise.resolve(crypto.randomBytes(16).toString("hex"))
}
