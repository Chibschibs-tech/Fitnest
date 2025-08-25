import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session-id")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Initializing subscription plans...")

    // First, check if subscription_plans table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'subscription_plans'
      )
    `

    if (!tableExists[0].exists) {
      return NextResponse.json(
        {
          success: false,
          error: "Subscription tables don't exist. Please create them first.",
        },
        { status: 400 },
      )
    }

    // Get existing meal plan products
    const mealPlans = await sql`
      SELECT id, name, base_price 
      FROM products 
      WHERE product_type = 'subscription' 
      OR name ILIKE '%plan%'
      ORDER BY name
    `

    if (mealPlans.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No meal plan products found. Please create meal plan products first.",
        },
        { status: 400 },
      )
    }

    // Get some sample meals for each plan
    const meals = await sql`
      SELECT id, name, base_price, category
      FROM products 
      WHERE product_type = 'simple' 
      AND (name ILIKE '%chicken%' OR name ILIKE '%salmon%' OR name ILIKE '%quinoa%' OR name ILIKE '%bowl%')
      LIMIT 20
    `

    // Create subscription plans for each meal plan product
    const createdPlans = []

    for (const mealPlan of mealPlans) {
      // Check if plan already exists
      const existingPlan = await sql`
        SELECT id FROM subscription_plans WHERE product_id = ${mealPlan.id}
      `

      if (existingPlan.length > 0) {
        console.log(`Plan for product ${mealPlan.name} already exists, skipping...`)
        continue
      }

      // Create subscription plan
      const planResult = await sql`
        INSERT INTO subscription_plans (
          product_id, name, description, billing_period, price, 
          delivery_frequency, items_per_delivery, is_active
        ) VALUES (
          ${mealPlan.id},
          ${mealPlan.name},
          ${"Weekly meal plan with fresh, healthy meals delivered to your door"},
          'weekly',
          ${mealPlan.base_price || 299},
          'weekly',
          3,
          true
        ) RETURNING id, name
      `

      const planId = planResult[0].id
      createdPlans.push(planResult[0])

      // Add sample meals to this plan
      const planMeals = meals.slice(0, 6) // Take first 6 meals for each plan

      for (let i = 0; i < planMeals.length; i++) {
        const meal = planMeals[i]
        await sql`
          INSERT INTO subscription_plan_items (
            plan_id, product_id, quantity, is_optional, sort_order
          ) VALUES (
            ${planId},
            ${meal.id},
            1,
            ${i >= 3}, -- First 3 meals required, rest optional
            ${i}
          )
        `
      }
    }

    // Get some snack products to add as optional items
    const snacks = await sql`
      SELECT id, name, base_price
      FROM products 
      WHERE product_type = 'simple' 
      AND (name ILIKE '%bar%' OR name ILIKE '%snack%' OR name ILIKE '%granola%')
      LIMIT 5
    `

    // Add snacks as optional items to all plans
    for (const plan of createdPlans) {
      const planId = await sql`SELECT id FROM subscription_plans WHERE name = ${plan.name}`

      for (const snack of snacks) {
        await sql`
          INSERT INTO subscription_plan_items (
            plan_id, product_id, quantity, is_optional, additional_price, sort_order
          ) VALUES (
            ${planId[0].id},
            ${snack.id},
            1,
            true,
            ${snack.base_price || 25},
            100
          )
          ON CONFLICT DO NOTHING
        `
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdPlans.length} subscription plans`,
      plans: createdPlans,
    })
  } catch (error) {
    console.error("Init subscription plans error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
