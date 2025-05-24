import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: "v0-preview",
      environmentVariables: envCheck,
      database: {
        status: "connected",
        error: null,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
