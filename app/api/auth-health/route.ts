import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
    }

    // Check database connection
    let dbStatus = "unknown"
    let dbError = null

    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`SELECT NOW()`
      dbStatus = "connected"
    } catch (error) {
      dbStatus = "error"
      dbError = (error as Error).message
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      environmentVariables: envCheck,
      database: {
        status: dbStatus,
        error: dbError,
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
