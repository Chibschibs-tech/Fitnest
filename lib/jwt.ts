export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { success: false, message: "Login failed" }
  }
}

export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function getSession() {
  try {
    const response = await fetch("/api/auth/session")
    const data = await response.json()
    return data.user
  } catch (error) {
    return null
  }
}

export async function decrypt(token: string) {
  // Simple stub implementation
  try {
    return JSON.parse(Buffer.from(token, "base64").toString())
  } catch {
    return null
  }
}

export async function encrypt(payload: any) {
  // Simple stub implementation
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export async function verify(token: string) {
  // Simple stub implementation
  try {
    JSON.parse(Buffer.from(token, "base64").toString())
    return true
  } catch {
    return false
  }
}
