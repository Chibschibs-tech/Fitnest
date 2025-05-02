import { type NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const result = await login(formData)

  if (result.success) {
    return NextResponse.json({ success: true, user: result.session })
  } else {
    return NextResponse.json({ success: false, message: result.message }, { status: 401 })
  }
}
