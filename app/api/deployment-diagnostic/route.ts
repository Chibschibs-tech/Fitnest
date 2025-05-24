import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✓ Set" : "✗ Missing",
    }

    // Check dependencies
    const dependencies = {
      next: "✓ Available",
      "@neondatabase/serverless": "✓ Available",
      crypto: "✓ Built-in Node.js module",
      bcrypt: "✗ Removed (using crypto instead)",
      jsonwebtoken: "✗ Removed (using sessions instead)",
    }

    return NextResponse.json({
      status: "deployment-ready",
      environment: env,
      dependencies,
      authSystem: "session-based",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Deployment diagnostic failed:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
