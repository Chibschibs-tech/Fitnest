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

    // First, create the meal plan products if they don't exist
    await sql`
      INSERT INTO products (name, slug, description, product_type, base_price, stock_quantity, nutritional_info, dietary_tags, status) VALUES
      ('Stay Fit Plan', 'stay-fit-plan', 'Balanced meals for maintaining fitness and health', 'subscription', 299.00, 999, '{"calories": 1600, "protein": 120, "carbs": 160, "fat": 60}', ARRAY['balanced', 'maintenance'], 'active'),
      ('Weight Loss Plan', 'weight-loss-plan', 'Calorie-controlled meals designed for healthy weight loss', 'subscription', 299.00, 999, '{"calories": 1400, "protein": 120, "carbs": 140, "fat": 45}', ARRAY['low-calorie', 'weight-loss'], 'active'),
      ('Muscle Gain Plan', 'muscle-gain-plan', 'High-protein meals for muscle building and strength', 'subscription', 399.00, 999, '{"calories": 2200, "protein": 180, "carbs": 220, "fat": 80}', ARRAY['high-protein', 'muscle-gain'], 'active'),
      ('Keto Plan', 'keto-plan', 'Low-carb, high-fat ketogenic meals', 'subscription', 349.00, 999, '{"calories": 1800, "protein": 120, "carbs": 30, "fat": 140}', ARRAY['keto', 'low-carb'], 'active')
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        base_price = EXCLUDED.base_price,
        nutritional_info = EXCLUDED.nutritional_info,
        dietary_tags = EXCLUDED.dietary_tags
    `

    // Create subscription plans for each meal plan product
    await sql`
      INSERT INTO subscription_plans (product_id, name, description, billing_period, billing_interval, price, trial_period_days, delivery_frequency, items_per_delivery, is_active)
      SELECT 
        p.id,
        p.name,
        p.description,
        'weekly',
        1,
        p.base_price,
        7,
        'weekly',
        CASE 
          WHEN p.slug = 'muscle-gain-plan' THEN 3
          ELSE 2
        END,
        true
      FROM products p 
      WHERE p.product_type = 'subscription' 
      AND p.slug IN ('stay-fit-plan', 'weight-loss-plan', 'muscle-gain-plan', 'keto-plan')
      ON CONFLICT DO NOTHING
    `

    // Create sample meals for each plan type
    await sql`
      INSERT INTO products (name, slug, description, product_type, base_price, stock_quantity, nutritional_info, dietary_tags, status) VALUES
      -- Stay Fit meals
      ('Grilled Chicken Mediterranean Bowl', 'grilled-chicken-mediterranean-bowl', 'Grilled chicken with quinoa, vegetables and Mediterranean herbs', 'simple', 45.00, 50, '{"calories": 520, "protein": 35, "carbs": 45, "fat": 18}', ARRAY['high-protein', 'balanced'], 'active'),
      ('Salmon Teriyaki with Brown Rice', 'salmon-teriyaki-brown-rice', 'Fresh salmon with teriyaki glaze and brown rice', 'simple', 55.00, 40, '{"calories": 580, "protein": 40, "carbs": 50, "fat": 22}', ARRAY['high-protein', 'omega-3'], 'active'),
      
      -- Weight Loss meals
      ('Lean Turkey Salad Bowl', 'lean-turkey-salad-bowl', 'Lean turkey with mixed greens and light dressing', 'simple', 42.00, 45, '{"calories": 380, "protein": 32, "carbs": 25, "fat": 15}', ARRAY['low-calorie', 'high-protein'], 'active'),
      ('Grilled Fish with Steamed Vegetables', 'grilled-fish-steamed-vegetables', 'White fish with steamed broccoli and carrots', 'simple', 48.00, 35, '{"calories": 350, "protein": 35, "carbs": 20, "fat": 12}', ARRAY['low-calorie', 'lean'], 'active'),
      
      -- Muscle Gain meals
      ('High-Protein Beef Bowl', 'high-protein-beef-bowl', 'Lean beef with sweet potato and protein-rich sides', 'simple', 65.00, 30, '{"calories": 750, "protein": 55, "carbs": 60, "fat": 25}', ARRAY['high-protein', 'muscle-gain'], 'active'),
      ('Chicken Power Bowl', 'chicken-power-bowl', 'Double chicken breast with quinoa and nuts', 'simple', 60.00, 35, '{"calories": 720, "protein": 50, "carbs": 55, "fat": 22}', ARRAY['high-protein', 'muscle-gain'], 'active'),
      
      -- Keto meals
      ('Keto Salmon Avocado Bowl', 'keto-salmon-avocado-bowl', 'Salmon with avocado and low-carb vegetables', 'simple', 58.00, 25, '{"calories": 650, "protein": 35, "carbs": 8, "fat": 52}', ARRAY['keto', 'high-fat'], 'active'),
      ('Keto Chicken Cauliflower Rice', 'keto-chicken-cauliflower-rice', 'Chicken thighs with cauliflower rice and cheese', 'simple', 52.00, 30, '{"calories": 620, "protein": 40, "carbs": 10, "fat": 48}', ARRAY['keto', 'low-carb'], 'active'),
      
      -- Breakfast options
      ('Protein Pancakes', 'protein-pancakes', 'High-protein pancakes with berries', 'simple', 35.00, 50, '{"calories": 320, "protein": 25, "carbs": 30, "fat": 8}', ARRAY['breakfast', 'high-protein'], 'active'),
      ('Keto Avocado Eggs', 'keto-avocado-eggs', 'Scrambled eggs with avocado and cheese', 'simple', 32.00, 45, '{"calories": 380, "protein": 20, "carbs": 6, "fat": 32}', ARRAY['breakfast', 'keto'], 'active'),
      
      -- Snacks
      ('Protein Bar - Chocolate', 'protein-bar-chocolate', 'High-protein chocolate bar', 'simple', 25.00, 100, '{"calories": 250, "protein": 20, "carbs": 25, "fat": 8}', ARRAY['snack', 'high-protein'], 'active'),
      ('Mixed Nuts Pack', 'mixed-nuts-pack', 'Premium mix of almonds, walnuts, and cashews', 'simple', 30.00, 80, '{"calories": 180, "protein": 6, "carbs": 6, "fat": 16}', ARRAY['snack', 'keto'], 'active')
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        base_price = EXCLUDED.base_price,
        nutritional_info = EXCLUDED.nutritional_info,
        dietary_tags = EXCLUDED.dietary_tags
    `

    // Link meals to subscription plans
    const planMealMappings = [
      // Stay Fit Plan meals
      { planSlug: "stay-fit-plan", mealSlugs: ["grilled-chicken-mediterranean-bowl", "salmon-teriyaki-brown-rice"] },
      // Weight Loss Plan meals
      { planSlug: "weight-loss-plan", mealSlugs: ["lean-turkey-salad-bowl", "grilled-fish-steamed-vegetables"] },
      // Muscle Gain Plan meals
      {
        planSlug: "muscle-gain-plan",
        mealSlugs: ["high-protein-beef-bowl", "chicken-power-bowl", "grilled-chicken-mediterranean-bowl"],
      },
      // Keto Plan meals
      { planSlug: "keto-plan", mealSlugs: ["keto-salmon-avocado-bowl", "keto-chicken-cauliflower-rice"] },
    ]

    for (const mapping of planMealMappings) {
      // Get the subscription plan ID
      const [plan] = await sql`
        SELECT sp.id 
        FROM subscription_plans sp
        JOIN products p ON sp.product_id = p.id
        WHERE p.slug = ${mapping.planSlug}
      `

      if (plan) {
        // Add main meals to the plan
        for (let i = 0; i < mapping.mealSlugs.length; i++) {
          await sql`
            INSERT INTO subscription_plan_items (plan_id, product_id, quantity, is_optional, sort_order)
            SELECT ${plan.id}, p.id, 1, false, ${i + 1}
            FROM products p 
            WHERE p.slug = ${mapping.mealSlugs[i]}
            ON CONFLICT DO NOTHING
          `
        }

        // Add breakfast options (optional)
        const breakfastSlug = mapping.planSlug === "keto-plan" ? "keto-avocado-eggs" : "protein-pancakes"
        await sql`
          INSERT INTO subscription_plan_items (plan_id, product_id, quantity, is_optional, additional_price, sort_order)
          SELECT ${plan.id}, p.id, 1, true, 0, 100
          FROM products p 
          WHERE p.slug = ${breakfastSlug}
          ON CONFLICT DO NOTHING
        `

        // Add snack options (optional)
        const snackSlug = mapping.planSlug === "keto-plan" ? "mixed-nuts-pack" : "protein-bar-chocolate"
        await sql`
          INSERT INTO subscription_plan_items (plan_id, product_id, quantity, is_optional, additional_price, sort_order)
          SELECT ${plan.id}, p.id, 1, true, 0, 200
          FROM products p 
          WHERE p.slug = ${snackSlug}
          ON CONFLICT DO NOTHING
        `
      }
    }

    return NextResponse.json({
      success: true,
      message: "Subscription plans initialized successfully with meals and options",
    })
  } catch (error) {
    console.error("Subscription plans initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
