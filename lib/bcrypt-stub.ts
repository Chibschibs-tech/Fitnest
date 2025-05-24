/**
 * Bcrypt stub implementation using Node.js crypto
 */

import * as crypto from "crypto"

// Simple hash function using crypto
export function hash(data: string, saltOrRounds: string | number): Promise<string> {
  return new Promise((resolve) => {
    const salt = typeof saltOrRounds === "string" ? saltOrRounds : crypto.randomBytes(16).toString("hex")

    const hash = crypto
      .createHash("sha256")
      .update(data + salt)
      .digest("hex")

    resolve(`${salt}:${hash}`)
  })
}

// Simple compare function
export function compare(data: string, encrypted: string): Promise<boolean> {
  return new Promise((resolve) => {
    const [salt, originalHash] = encrypted.split(":")

    if (!salt || !originalHash) {
      resolve(false)
      return
    }

    const hash = crypto
      .createHash("sha256")
      .update(data + salt)
      .digest("hex")

    resolve(hash === originalHash)
  })
}

// Export other bcrypt functions as needed
export const genSalt = (rounds: number): Promise<string> => {
  return Promise.resolve(crypto.randomBytes(16).toString("hex"))
}

export default {
  hash,
  compare,
  genSalt,
}
