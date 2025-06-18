import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

interface CSVMealData {
  name: string
  muscleGainIngredients: string
  weightLossIngredients: string
  stayFitIngredients: string
}

interface ParsedIngredient {
  name: string
  amount: number
  unit: string
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting direct meal import...")

    // Fetch the CSV file
    const csvUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Meals%20to%20upload-sy0jp5AbCZaqrP316g5GSKYTXg1xFj.csv"
    const response = await fetch(csvUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`)
    }

    const csvContent = await response.text()
    console.log("📄 CSV file fetched successfully")

    // Parse CSV
    const csvData = parseCSV(csvContent)
    console.log(`📊 Parsed ${csvData.length} meals from CSV`)

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

    // Clear existing meals
    await sql`DELETE FROM meals WHERE plan_type IN ('muscle-gain', 'weight-loss', 'stay-fit')`

    let insertedCount = 0

    // Process each meal for each plan type
    for (const csvMeal of csvData) {
      const planTypes = [
        { type: "muscle-gain", ingredients: csvMeal.muscleGainIngredients },
        { type: "weight-loss", ingredients: csvMeal.weightLossIngredients },
        { type: "stay-fit", ingredients: csvMeal.stayFitIngredients },
      ]

      for (const plan of planTypes) {
        if (plan.ingredients && plan.ingredients.trim()) {
          try {
            const ingredients = parseIngredients(plan.ingredients)
            const nutrition = await calculateNutritionUSDA(ingredients)

            const mealName = `${csvMeal.name} (${plan.type.replace("-", " ")})`

            await sql`
              INSERT INTO meals (
                name, description, ingredients, calories, protein, carbs, fat, fiber,
                meal_type, plan_type, tags, dietary_info, image_url
              ) VALUES (
                ${mealName},
                ${`Delicious ${csvMeal.name.toLowerCase()} optimized for ${plan.type.replace("-", " ")} goals.`},
                ${JSON.stringify(ingredients)},
                ${nutrition.calories},
                ${nutrition.protein},
                ${nutrition.carbs},
                ${nutrition.fat},
                ${nutrition.fiber},
                ${determineMealType(csvMeal.name)},
                ${plan.type},
                ${generateTags(csvMeal.name, ingredients)},
                ${generateDietaryInfo(ingredients)},
                ${generateImageUrl(csvMeal.name)}
              )
            `
            insertedCount++
            console.log(`✅ Inserted: ${mealName}`)
          } catch (error) {
            console.error(`❌ Error processing ${csvMeal.name} (${plan.type}):`, error)
          }
        }
      }
    }

    console.log(`🎉 Successfully imported ${insertedCount} meals`)

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${insertedCount} meals`,
      totalMeals: insertedCount,
    })
  } catch (error) {
    console.error("❌ Import failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function parseCSV(csvContent: string): CSVMealData[] {
  const lines = csvContent.split("\n").filter((line) => line.trim())
  const meals: CSVMealData[] = []

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVRow(lines[i])
    if (row.length >= 4) {
      meals.push({
        name: row[0]?.trim() || "",
        muscleGainIngredients: row[1]?.trim() || "",
        weightLossIngredients: row[2]?.trim() || "",
        stayFitIngredients: row[3]?.trim() || "",
      })
    }
  }

  return meals.filter((meal) => meal.name)
}

function parseCSVRow(row: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""))
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim().replace(/^"|"$/g, ""))
  return result
}

function parseIngredients(ingredientString: string): ParsedIngredient[] {
  const ingredients = ingredientString.split("\n").filter((line) => line.trim())
  const parsed: ParsedIngredient[] = []

  for (const ingredient of ingredients) {
    const match = ingredient.match(/^(.+?):\s*(\d+(?:\.\d+)?)\s*(\w+)/)
    if (match) {
      const [, name, amount, unit] = match
      parsed.push({
        name: name.trim(),
        amount: Number.parseFloat(amount),
        unit: unit,
      })
    }
  }

  return parsed
}

async function calculateNutritionUSDA(ingredients: ParsedIngredient[]): Promise<{
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}> {
  const usdaApiKey = process.env.USDA_API_KEY

  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0
  let totalFiber = 0

  for (const ingredient of ingredients) {
    try {
      if (usdaApiKey) {
        const nutrition = await getUSDANutrition(ingredient.name, ingredient.amount, ingredient.unit, usdaApiKey)
        if (nutrition) {
          totalCalories += nutrition.calories
          totalProtein += nutrition.protein
          totalCarbs += nutrition.carbs
          totalFat += nutrition.fat
          totalFiber += nutrition.fiber
          continue
        }
      }

      // Fallback nutrition
      const fallback = getFallbackNutrition(ingredient.name, ingredient.amount)
      totalCalories += fallback.calories
      totalProtein += fallback.protein
      totalCarbs += fallback.carbs
      totalFat += fallback.fat
      totalFiber += fallback.fiber
    } catch (error) {
      console.warn(`Could not get nutrition for ${ingredient.name}:`, error)
      const fallback = getFallbackNutrition(ingredient.name, ingredient.amount)
      totalCalories += fallback.calories
      totalProtein += fallback.protein
      totalCarbs += fallback.carbs
      totalFat += fallback.fat
      totalFiber += fallback.fiber
    }
  }

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    fiber: Math.round(totalFiber * 10) / 10,
  }
}

async function getUSDANutrition(ingredientName: string, amount: number, unit: string, apiKey: string) {
  try {
    // Search for the ingredient
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(ingredientName)}&api_key=${apiKey}&dataType=Foundation,SR%20Legacy&pageSize=1`

    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (!searchData.foods || searchData.foods.length === 0) {
      return null
    }

    const foodId = searchData.foods[0].fdcId

    // Get detailed nutrition data
    const detailUrl = `https://api.nal.usda.gov/fdc/v1/food/${foodId}?api_key=${apiKey}`
    const detailResponse = await fetch(detailUrl)
    const detailData = await detailResponse.json()

    const nutrients = detailData.foodNutrients || []
    const multiplier = getAmountMultiplier(amount, unit)

    const calories = (findNutrient(nutrients, "Energy") * multiplier) / 100
    const protein = (findNutrient(nutrients, "Protein") * multiplier) / 100
    const carbs = (findNutrient(nutrients, "Carbohydrate, by difference") * multiplier) / 100
    const fat = (findNutrient(nutrients, "Total lipid (fat)") * multiplier) / 100
    const fiber = (findNutrient(nutrients, "Fiber, total dietary") * multiplier) / 100

    return { calories, protein, carbs, fat, fiber }
  } catch (error) {
    return null
  }
}

function findNutrient(nutrients: any[], nutrientName: string): number {
  const nutrient = nutrients.find((n) => n.nutrient?.name?.toLowerCase().includes(nutrientName.toLowerCase()))
  return nutrient?.amount || 0
}

function getAmountMultiplier(amount: number, unit: string): number {
  const unitConversions: Record<string, number> = {
    grams: 1,
    g: 1,
    kg: 1000,
    oz: 28.35,
    lb: 453.592,
  }

  return amount * (unitConversions[unit.toLowerCase()] || 1)
}

function getFallbackNutrition(ingredientName: string, amount: number) {
  const fallbackData: Record<string, { calories: number; protein: number; carbs: number; fat: number; fiber: number }> =
    {
      "chia seeds": { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34 },
      "greek yogurt": { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0 },
      "mixed berries": { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 },
      "almond milk": { calories: 17, protein: 0.6, carbs: 1.5, fat: 1.1, fiber: 0.1 },
      "coconut milk": { calories: 17, protein: 0.6, carbs: 1.5, fat: 1.1, fiber: 0.1 },
      "chicken breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
      salmon: { calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0 },
      quinoa: { calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8 },
      "brown rice": { calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
      broccoli: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
      spinach: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    }

  const lowerName = ingredientName.toLowerCase()
  for (const [key, nutrition] of Object.entries(fallbackData)) {
    if (lowerName.includes(key)) {
      const multiplier = amount / 100 // per 100g
      return {
        calories: nutrition.calories * multiplier,
        protein: nutrition.protein * multiplier,
        carbs: nutrition.carbs * multiplier,
        fat: nutrition.fat * multiplier,
        fiber: nutrition.fiber * multiplier,
      }
    }
  }

  return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
}

function determineMealType(mealName: string): string {
  const name = mealName.toLowerCase()

  if (name.includes("breakfast") || name.includes("pudding") || name.includes("oats")) {
    return "breakfast"
  }
  if (name.includes("snack") || name.includes("bar")) {
    return "snack"
  }
  return "main"
}

function generateTags(mealName: string, ingredients: ParsedIngredient[]): string[] {
  const tags = []
  const name = mealName.toLowerCase()
  const ingredientNames = ingredients.map((i) => i.name.toLowerCase()).join(" ")

  if (name.includes("breakfast")) tags.push("breakfast")
  if (
    ingredientNames.includes("protein") ||
    ingredientNames.includes("chicken") ||
    ingredientNames.includes("salmon")
  ) {
    tags.push("high-protein")
  }
  if (!ingredientNames.includes("meat") && !ingredientNames.includes("chicken")) {
    tags.push("vegetarian")
  }

  return tags
}

function generateDietaryInfo(ingredients: ParsedIngredient[]): string[] {
  const dietary = []
  const ingredientNames = ingredients.map((i) => i.name.toLowerCase()).join(" ")

  if (!ingredientNames.includes("gluten") && !ingredientNames.includes("wheat")) {
    dietary.push("gluten-free")
  }
  if (!ingredientNames.includes("dairy") && !ingredientNames.includes("milk") && !ingredientNames.includes("cheese")) {
    dietary.push("dairy-free")
  }
  if (!ingredientNames.includes("meat") && !ingredientNames.includes("chicken")) {
    dietary.push("vegetarian")
  }

  return dietary
}

function generateImageUrl(mealName: string): string {
  const name = mealName.toLowerCase()

  if (name.includes("chia") && name.includes("pudding")) return "/layered-berry-parfait.png"
  if (name.includes("chicken")) return "/grilled-chicken-vegetable-medley.png"
  if (name.includes("salmon")) return "/pan-seared-salmon-quinoa.png"
  if (name.includes("quinoa")) return "/rainbow-grain-bowl.png"

  return "/vibrant-nutrition-plate.png"
}

export async function GET() {
  return NextResponse.json({
    message: "Direct meal import API ready",
    endpoint: "POST /api/import-meals-direct",
  })
}
