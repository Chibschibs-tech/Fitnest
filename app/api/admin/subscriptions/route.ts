import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("=== SUBSCRIPTIONS API DEBUG ===")

    // Check if user is authenticated and is admin
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      console.log("No session ID found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      console.log("User not admin or not found:", user)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Admin authenticated, fetching subscriptions...")

    // First, let's see what tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `
    console.log(
      "Available tables:",
      tables.map((t) => t.table_name),
    )

    // Check orders table structure
    const ordersStructure = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND table_schema = 'public'
      ORDER BY ordinal_position
    `
    console.log("Orders table columns:", ordersStructure)

    // Get all orders first to see what we have
    const allOrders = await sql`SELECT * FROM orders LIMIT 5`
    console.log("Sample orders:", allOrders)

    // Get subscription data with multiple fallback strategies
    let subscriptions = []

    try {
      // Strategy 1: Try with meal_plans join
      console.log("Trying Strategy 1: meal_plans join")
      subscriptions = await sql`
        SELECT 
          o.id,
          o.user_id,
          COALESCE(u.name, 'Unknown Customer') as customer_name,
          COALESCE(u.email, 'unknown@email.com') as customer_email,
          COALESCE(mp.name, 'Custom Plan') as plan_name,
          o.status,
          COALESCE(o.total_amount, o.total, 0)::numeric as weekly_price,
          o.created_at as start_date,
          (o.created_at + INTERVAL '7 days') as next_delivery,
          1 as total_orders,
          COALESCE(o.total_amount, o.total, 0)::numeric as total_spent,
          o.created_at
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN meal_plans mp ON o.meal_plan_id = mp.id
        WHERE u.role != 'admin' OR u.role IS NULL
        ORDER BY o.created_at DESC
        LIMIT 50
      `
      console.log(`Strategy 1 found ${subscriptions.length} subscriptions`)
    } catch (error) {
      console.log("Strategy 1 failed:", error)

      try {
        // Strategy 2: Simple orders without meal_plans join
        console.log("Trying Strategy 2: simple orders")
        subscriptions = await sql`
          SELECT 
            o.id,
            o.user_id,
            COALESCE(u.name, 'Unknown Customer') as customer_name,
            COALESCE(u.email, 'unknown@email.com') as customer_email,
            'Custom Plan' as plan_name,
            COALESCE(o.status, 'active') as status,
            COALESCE(o.total_amount, o.total, 0)::numeric as weekly_price,
            o.created_at as start_date,
            (o.created_at + INTERVAL '7 days') as next_delivery,
            1 as total_orders,
            COALESCE(o.total_amount, o.total, 0)::numeric as total_spent,
            o.created_at
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          WHERE (u.role != 'admin' OR u.role IS NULL)
          ORDER BY o.created_at DESC
          LIMIT 50
        `
        console.log(`Strategy 2 found ${subscriptions.length} subscriptions`)
      } catch (error2) {
        console.log("Strategy 2 failed:", error2)

        try {
          // Strategy 3: All orders without user filter
          console.log("Trying Strategy 3: all orders")
          subscriptions = await sql`
            SELECT 
              id,
              user_id,
              'Unknown Customer' as customer_name,
              'unknown@email.com' as customer_email,
              'Custom Plan' as plan_name,
              COALESCE(status, 'active') as status,
              COALESCE(total_amount, total, 0)::numeric as weekly_price,
              created_at as start_date,
              (created_at + INTERVAL '7 days') as next_delivery,
              1 as total_orders,
              COALESCE(total_amount, total, 0)::numeric as total_spent,
              created_at
            FROM orders
            ORDER BY created_at DESC
            LIMIT 50
          `
          console.log(`Strategy 3 found ${subscriptions.length} subscriptions`)
        } catch (error3) {
          console.log("Strategy 3 failed:", error3)
          subscriptions = []
        }
      }
    }

    console.log("Final subscriptions data:", subscriptions)

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions,
      debug: {
        tablesFound: tables.length,
        ordersColumns: ordersStructure.length,
        subscriptionsReturned: subscriptions.length,
      },
    })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch subscriptions",
        subscriptions: [],
        debug: { error: error.message },
      },
      { status: 500 },
    )
  }
}
