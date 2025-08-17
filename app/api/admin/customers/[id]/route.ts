import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id

    // Get customer details
    const customerResult = await sql`
      SELECT 
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users 
      WHERE id = ${customerId}
      AND role = 'customer'
    `

    if (customerResult.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Customer not found",
      })
    }

    const customer = customerResult[0]

    // Get customer's orders
    const orders = await sql`
      SELECT 
        id,
        status,
        total_amount,
        created_at,
        meal_plan_name
      FROM orders 
      WHERE user_id = ${customerId}
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      customer,
      orders,
    })
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
