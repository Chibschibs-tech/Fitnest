import { type NextRequest, NextResponse } from "next/server"
import { MealImportService } from "@/lib/meal-import-service"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting meal import process...")

    // Fetch the CSV file
    const csvUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Meals%20to%20upload-sy0jp5AbCZaqrP316g5GSKYTXg1xFj.csv"
    const response = await fetch(csvUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`)
    }

    const csvContent = await response.text()
    console.log("📄 CSV file fetched successfully")

    // Initialize the import service
    const importService = new MealImportService()

    // Parse CSV data
    const csvData = importService.parseCSV(csvContent)
    console.log(`📊 Parsed ${csvData.length} meals from CSV`)

    // Process meals (this will take time due to USDA API calls)
    console.log("🔄 Processing meals with USDA nutrition data...")
    const processedMeals = await importService.processAllMeals(csvData)
    console.log(`✅ Processed ${processedMeals.length} meal variations`)

    // Ensure meals table exists
    await sql`
      CREATE TABLE IF NOT EXISTS meals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        ingredients JSONB,
        calories INTEGER,
        protein DECIMAL(5,2),
        carbs DECIMAL(5,2),
        fat DECIMAL(5,2),
        fiber DECIMAL(5,2),
        meal_type VARCHAR(50),
        plan_type VARCHAR(50),
        tags TEXT[],
        dietary_info TEXT[],
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Clear existing meals (optional - remove if you want to keep existing)
    await sql`DELETE FROM meals WHERE plan_type IN ('muscle-gain', 'weight-loss', 'stay-fit')`

    // Insert processed meals
    let insertedCount = 0
    for (const meal of processedMeals) {
      try {
        await sql`
          INSERT INTO meals (
            name, description, ingredients, calories, protein, carbs, fat, fiber,
            meal_type, plan_type, tags, dietary_info, image_url
          ) VALUES (
            ${meal.name},
            ${meal.description},
            ${JSON.stringify(meal.ingredients)},
            ${meal.calories},
            ${meal.protein},
            ${meal.carbs},
            ${meal.fat},
            ${meal.fiber},
            ${meal.mealType},
            ${meal.planType},
            ${meal.tags},
            ${meal.dietaryInfo},
            ${generateImageUrl(meal.name)}
          )
        `
        insertedCount++
      } catch (error) {
        console.error(`Failed to insert meal: ${meal.name}`, error)
      }
    }

    console.log(`🎉 Successfully imported ${insertedCount} meals to database`)

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${insertedCount} meals`,
      totalProcessed: processedMeals.length,
      csvMeals: csvData.length,
    })
  } catch (error) {
    console.error("❌ Meal import failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateImageUrl(mealName: string): string {
  // Generate appropriate image URLs based on meal name
  const name = mealName.toLowerCase()

  if (name.includes("chia") && name.includes("pudding")) {
    return "/layered-berry-parfait.png"
  }
  if (name.includes("chicken")) {
    return "/grilled-chicken-vegetable-medley.png"
  }
  if (name.includes("salmon")) {
    return "/pan-seared-salmon-quinoa.png"
  }
  if (name.includes("quinoa")) {
    return "/rainbow-grain-bowl.png"
  }

  // Default to a generic healthy meal image
  return "/vibrant-nutrition-plate.png"
}

export async function GET() {
  return NextResponse.json({
    message: "Meal import API ready",
    endpoint: "POST /api/import-meals",
  })
}
