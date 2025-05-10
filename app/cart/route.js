import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.redirect(new URL("/shopping-cart", "https://fitnest-ma.vercel.app"))
}
