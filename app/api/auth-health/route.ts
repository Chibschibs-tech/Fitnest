import { NextResponse } from "next/server"
import { testAuthDbConnection, validateAuthEnvironment } from "@/lib/auth-utils"

export async function GET() {
  try {
    // Check environment variables
    const envCheck = validateAuthEnvironment()

    // Check database connection
    const dbCheck = await testAuthDbConnection()

    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: dbCheck,
    })
  } catch (error) {
    console.error("Auth health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Auth health check failed",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
