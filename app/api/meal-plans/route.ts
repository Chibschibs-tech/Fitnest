import { NextResponse } from "next/server"
import { db, mealPlans } from "@/lib/db"

export async function GET() {
  try {
    const plans = await db.select().from(mealPlans).where({ isActive: true })

    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching meal plans:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
