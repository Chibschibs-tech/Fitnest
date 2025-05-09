import { type NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const formData = new FormData()

    // Convert JSON body to FormData for compatibility with the login function
    formData.append("email", body.email)
    formData.append("password", body.password)

    const result = await login(formData)

    if (result.success) {
      return NextResponse.json({ success: true, user: result.session })
    } else {
      console.error("Login failed:", result.message)
      return NextResponse.json({ success: false, message: result.message }, { status: 401 })
    }
  } catch (error) {
    console.error("Login route error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
