// Stub file to satisfy imports - redirects to session-based auth

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

    if (data.success) {
      return { success: true, session: data.user }
    } else {
      return { success: false, message: data.error }
    }
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

// Stub decrypt function for compatibility
export async function decrypt(token: string) {
  // Since we're using session-based auth, this is a stub
  // In a real JWT implementation, this would decrypt the token
  try {
    // For compatibility, we'll try to get the current session
    const session = await getSession()
    return session
  } catch (error) {
    return null
  }
}

// Additional JWT-related stubs that might be needed
export async function encrypt(payload: any) {
  // Stub function - in session-based auth, we don't encrypt tokens
  return JSON.stringify(payload)
}

export async function verify(token: string) {
  // Stub function - verify session instead
  const session = await getSession()
  return !!session
}
