import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

export async function GET() {
  try {
    const session = await getServerSession()

    return NextResponse.json({
      status: "success",
      authenticated: !!session,
      session: session
        ? {
            user: {
              name: session.user?.name,
              email: session.user?.email,
              role: session.user?.role,
            },
          }
        : null,
      timestamp: new Date().toISOString(),
      env: {
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nodeEnv: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    console.error("Auth status check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
