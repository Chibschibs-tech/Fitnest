import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Check database connection
    const dbStatus = await checkDatabaseConnection()

    // Check environment variables (without exposing sensitive values)
    const envVars = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEON_DATABASE_URL: !!process.env.NEON_DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      JWT_SECRET: !!process.env.JWT_SECRET,
      EMAIL_SERVER_HOST: !!process.env.EMAIL_SERVER_HOST,
      EMAIL_SERVER_PORT: !!process.env.EMAIL_SERVER_PORT,
      EMAIL_SERVER_USER: !!process.env.EMAIL_SERVER_USER,
      EMAIL_SERVER_PASSWORD: !!process.env.EMAIL_SERVER_PASSWORD,
      EMAIL_FROM: !!process.env.EMAIL_FROM,
      NODE_ENV: process.env.NODE_ENV,
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbStatus,
      environmentVariables: envVars,
    })
  } catch (error) {
    console.error("Deployment diagnostic error:", error)
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
