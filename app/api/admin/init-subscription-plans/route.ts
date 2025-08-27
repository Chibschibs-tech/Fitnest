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

    // First check if tables exist
    const tablesCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('subscription_plans', 'subscription_plan_items', 'products')
    `

    const tableNames = tablesCheck.map((row) => row.table_name)
    if (!tableNames.includes("subscription_plans") || !tableNames.includes("subscription_plan_items")) {
      return NextResponse.json(
        {
          success: false,
          error: "Subscription tables don't exist. Please create them first.",
          missingTables: ["subscription_plans", "subscription_plan_items"].filter((t) => !tableNames.includes(t)),
        },
        { status: 400 },
      )
    }

    if (!tableNames.includes("products")) {
      return NextResponse.json(
        {
          success: false,
          error: "Products table doesn't exist. Please ensure your database is properly initialized.",
        },
        { status: 400 },
      )
    }

    // Check what columns exist in products table
    const productsColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'products'
    `

    const columnNames = productsColumns.map((col) => col.column_name)
    console.log("Available product columns:", columnNames)

    const priceColumn = columnNames.includes("base_price")
      ? "base_price"
      : columnNames.includes("price")
        ? "price"
        : columnNames.includes("weekly_price")
          ? "weekly_price"
          : null

    if (!priceColumn) {
      return NextResponse.json(
        {
          success: false,
          error: "No price column found in products table.",
          details: {
            availableColumns: columnNames,
            expectedColumns: ["base_price", "price", "weekly_price"],
          },
        },
        { status: 400 },
      )
    }

    // Get existing meal plan products - look for products that could be meal plans
    const mealPlanProducts = await sql`
      SELECT id, name, ${sql(priceColumn)} as price 
      FROM products 
      WHERE name ILIKE '%plan%' 
      OR name ILIKE '%vegan%' 
      OR name ILIKE '%keto%' 
      OR name ILIKE '%muscle%' 
      OR name ILIKE '%weight%'
      OR name ILIKE '%fit%'
      ORDER BY name
    `

    console.log("Found meal plan products:", mealPlanProducts.length)

    if (mealPlanProducts.length === 0) {
      // Create some default meal plan products if none exist
      const defaultPlans = [
        { name: "Stay Fit Plan", price: 299 },
        { name: "Weight Loss Plan", price: 299 },
        { name: "Muscle Gain Plan", price: 399 },
        { name: "Keto Plan", price: 349 },
      ]

      console.log("Creating default meal plan products...")

      for (const plan of defaultPlans) {
        const slug = plan.name.toLowerCase().replace(/\s+/g, "-")
        try {
          await sql`
            INSERT INTO products (name, slug, description, product_type, ${sql(priceColumn)}, stock_quantity, is_active)
            VALUES (
              ${plan.name},
              ${slug},
              ${"Weekly meal plan with fresh, healthy meals"},
              'subscription',
              ${plan.price},
              999,
              true
            )
            ON CONFLICT (slug) DO NOTHING
          `
          console.log(`Created product: ${plan.name}`)
        } catch (error) {
          console.error(`Error creating product ${plan.name}:`, error)
        }
      }

      // Re-fetch the products we just created
      const newMealPlans = await sql`
        SELECT id, name, ${sql(priceColumn)} as price 
        FROM products 
        WHERE name IN ('Stay Fit Plan', 'Weight Loss Plan', 'Muscle Gain Plan', 'Keto Plan')
      `
      mealPlanProducts.push(...newMealPlans)
      console.log("Total meal plan products after creation:", mealPlanProducts.length)
    }

    // Get some sample meals for plan items
    const sampleMeals = await sql`
      SELECT id, name, ${sql(priceColumn)} as price 
      FROM products 
      WHERE product_type = 'simple' 
      AND name NOT ILIKE '%plan%'
      LIMIT 20
    `

    console.log("Found sample meals:", sampleMeals.length)

    let createdPlans = 0
    let createdItems = 0

    // Create subscription plans for each meal plan product
    for (const product of mealPlanProducts) {
      console.log(`Processing product: ${product.name} (ID: ${product.id})`)

      // Check if plan already exists
      const existingPlan = await sql`
        SELECT id FROM subscription_plans WHERE product_id = ${product.id}
      `

      if (existingPlan.length > 0) {
        console.log(`Plan for product ${product.name} already exists, skipping...`)
        continue
      }

      // Determine plan details based on product name
      const billingPeriod = "weekly"
      const deliveryFrequency = "weekly"
      let itemsPerDelivery = 3
      let price = product.price || 299

      if (product.name.toLowerCase().includes("muscle")) {
        price = 399
        itemsPerDelivery = 4
      } else if (product.name.toLowerCase().includes("keto")) {
        price = 349
      }

      try {
        // Create subscription plan
        const planResult = await sql`
          INSERT INTO subscription_plans (
            product_id, name, description, billing_period, price, 
            delivery_frequency, items_per_delivery, is_active
          ) VALUES (
            ${product.id}, 
            ${product.name}, 
            ${"Weekly meal plan with " + itemsPerDelivery + " meals per delivery"}, 
            ${billingPeriod}, 
            ${price}, 
            ${deliveryFrequency}, 
            ${itemsPerDelivery}, 
            true
          ) RETURNING id
        `

        const planId = planResult[0].id
        createdPlans++
        console.log(`Created subscription plan: ${product.name} (Plan ID: ${planId})`)

        // Add sample meals to the plan if we have any
        if (sampleMeals.length > 0) {
          const mealsToAdd = sampleMeals.slice(0, Math.min(8, sampleMeals.length))

          for (let i = 0; i < mealsToAdd.length; i++) {
            const meal = mealsToAdd[i]

            try {
              await sql`
                INSERT INTO subscription_plan_items (
                  plan_id, product_id, quantity, is_optional, sort_order
                ) VALUES (
                  ${planId}, 
                  ${meal.id}, 
                  1, 
                  ${i >= itemsPerDelivery}, 
                  ${i}
                )
              `
              createdItems++
            } catch (itemError) {
              console.error(`Error creating plan item for meal ${meal.name}:`, itemError)
            }
          }
          console.log(`Added ${mealsToAdd.length} items to plan ${product.name}`)
        }
      } catch (planError) {
        console.error(`Error creating plan for product ${product.name}:`, planError)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdPlans} subscription plans with ${createdItems} plan items`,
      details: {
        plansCreated: createdPlans,
        itemsCreated: createdItems,
        mealPlanProducts: mealPlanProducts.length,
        sampleMeals: sampleMeals.length,
        priceColumnUsed: priceColumn,
        availableColumns: columnNames || [],
      },
    })
  } catch (error) {
    console.error("Init subscription plans error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: {
          stack: error instanceof Error ? error.stack : undefined,
          message: error instanceof Error ? error.message : "Unknown error occurred",
        },
      },
      { status: 500 },
    )
  }
}
