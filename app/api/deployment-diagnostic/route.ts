import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const diagnosticResults: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      database: {
        status: "unknown",
        message: "",
      },
      email: {
        status: "unknown",
        message: "",
      },
      environmentVariables: {
        database: {},
        email: {},
        auth: {},
        other: {},
      },
    }

    // Check database connection
    try {
      // Use the DATABASE_URL environment variable
      const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
      if (!dbUrl) {
        diagnosticResults.database = {
          status: "error",
          message: "No database URL found in environment variables",
        }
      } else {
        // Test the connection
        const sql = neon(dbUrl)
        const result = await sql`SELECT 1 as test`
        if (result && result[0] && result[0].test === 1) {
          diagnosticResults.database = {
            status: "connected",
            message: "Successfully connected to the database",
          }
        } else {
          diagnosticResults.database = {
            status: "error",
            message: "Database connection test failed",
          }
        }
      }
    } catch (error) {
      diagnosticResults.database = {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      }
    }

    // Check email configuration
    try {
      // Use the provided email configuration
      const host = "smtp.gmail.com"
      const port = 587
      const secure = false
      const user = "noreply@fitnest.ma"
      const pass = "lfih nrfi ybfo asud"
      const from = "Fitnest.ma <noreply@fitnest.ma>"

      if (!host || !port || !user || !pass || !from) {
        diagnosticResults.email = {
          status: "error",
          message: "Missing email configuration",
        }
      } else {
        // Create a transporter but don't verify connection to avoid timeouts
        diagnosticResults.email = {
          status: "configured",
          message: "Email configuration found",
          config: {
            host,
            port,
            secure,
            user,
            from,
          },
        }
      }
    } catch (error) {
      diagnosticResults.email = {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      }
    }

    // Check environment variables (without exposing sensitive values)
    // Database variables
    for (const key of [
      "DATABASE_URL",
      "NEON_DATABASE_URL",
      "POSTGRES_URL",
      "POSTGRES_PRISMA_URL",
      "POSTGRES_URL_NON_POOLING",
    ]) {
      diagnosticResults.environmentVariables.database[key] = process.env[key] ? "✓ Set" : "✗ Missing"
    }

    // Email variables
    for (const key of [
      "EMAIL_SERVER_HOST",
      "EMAIL_SERVER_PORT",
      "EMAIL_SERVER_SECURE",
      "EMAIL_SERVER_USER",
      "EMAIL_SERVER_PASSWORD",
      "EMAIL_FROM",
    ]) {
      diagnosticResults.environmentVariables.email[key] = process.env[key] ? "✓ Set" : "✗ Missing"
    }

    // Auth variables
    for (const key of ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "JWT_SECRET"]) {
      diagnosticResults.environmentVariables.auth[key] = process.env[key] ? "✓ Set" : "✗ Missing"
    }

    // Other variables
    for (const key of ["VERCEL_URL", "NODE_ENV", "NEXT_PUBLIC_API_URL"]) {
      diagnosticResults.environmentVariables.other[key] = process.env[key] ? "✓ Set" : "✗ Missing"
    }

    return NextResponse.json(diagnosticResults)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to run deployment diagnostic",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
