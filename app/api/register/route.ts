import bcrypt from "bcryptjs" // Changed from bcrypt to bcryptjs
import { NextResponse } from "next/server"

import prisma from "@/app/libs/prismadb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })

    // Ensure proper response is returned
    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error: any) {
    // Check for any errors in the registration route handler
    // Make sure the error handling is properly implemented
    console.error("REGISTRATION_ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
