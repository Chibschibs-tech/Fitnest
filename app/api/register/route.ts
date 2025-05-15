import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { eq } from "drizzle-orm"
import { db, users } from "@/lib/db"
import { sendWelcomeEmail } from "@/lib/email-utils"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name)
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError)
      // Continue with the response even if email fails
    }

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
