import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 })

    // Clear token cookie
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "An error occurred during logout." }, { status: 500 })
  }
}
