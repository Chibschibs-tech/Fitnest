import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "Middleware check endpoint is working",
    timestamp: new Date().toISOString(),
    publicRoutes: ["/", "/login", "/register", "/meal-plans", "/how-it-works", "/about", "/contact"],
  })
}
