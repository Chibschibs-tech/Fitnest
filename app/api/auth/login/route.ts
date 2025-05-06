import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/app/libs/prismadb"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Find user with Prisma instead of MongoDB
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 })
    }

    // Check if hashedPassword exists (Prisma schema likely uses hashedPassword, not password)
    if (!user.hashedPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 })
    }

    // Compare password with hashedPassword
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword)

    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 })
    }

    // Return user without the password
    const { hashedPassword, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An error occurred during login." }, { status: 500 })
  }
}
