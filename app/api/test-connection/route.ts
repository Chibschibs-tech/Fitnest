import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json(
      {
        status: "success",
        message: "API connection successful",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("API test error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "API connection failed",
      },
      { status: 500 },
    )
  }
}
