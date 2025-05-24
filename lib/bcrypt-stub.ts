import crypto from "crypto"

export function hash(data: string, saltOrRounds: string | number): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto
    .createHash("sha256")
    .update(data + salt)
    .digest("hex")
  return Promise.resolve(`$2b$10$${salt}$${hash}`)
}

export function compare(data: string, encrypted: string): Promise<boolean> {
  try {
    const parts = encrypted.split("$")
    if (parts.length < 4) return Promise.resolve(false)

    const salt = parts[3]
    const newHash = crypto
      .createHash("sha256")
      .update(data + salt)
      .digest("hex")

    const expectedFormat = `$2b$10$${salt}$${newHash}`
    return Promise.resolve(expectedFormat === encrypted)
  } catch (error) {
    return Promise.resolve(false)
  }
}

export function genSalt(rounds: number): Promise<string> {
  return Promise.resolve(crypto.randomBytes(16).toString("hex"))
}
