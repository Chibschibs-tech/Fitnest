import { NextResponse } from "next/server"
import { INGREDIENTS_DB } from "@/lib/ingredients-db"

// USDA-only verification system
export async function GET() {
  try {
    const results = []
    let verifiedCount = 0
    let accurateCount = 0
    let needsVerificationCount = 0

    for (const [id, ingredient] of Object.entries(INGREDIENTS_DB)) {
      try {
        // Search USDA for this ingredient
        const searchResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/nutrition-lookup?query=${encodeURIComponent(ingredient.name)}`,
        )

        if (!searchResponse.ok) {
          results.push({
            ingredient: ingredient.name,
            id,
            status: "API Error",
            needsVerification: true,
            ourValues: {
              calories: ingredient.calories,
              protein: ingredient.protein,
              carbs: ingredient.carbs,
              fat: ingredient.fat,
              fiber: ingredient.fiber,
              sugar: ingredient.sugar,
              sodium: ingredient.sodium,
            },
          })
          needsVerificationCount++
          continue
        }

        const searchData = await searchResponse.json()

        if (searchData.status === "success" && searchData.data.length > 0) {
          // Use the best match (first result after USDA sorting)
          const bestMatch = searchData.data[0]
          const referenceValues = bestMatch.nutrition

          // Calculate accuracy percentages
          const accuracy = {
            calories: Math.abs((ingredient.calories - referenceValues.calories) / referenceValues.calories) * 100,
            protein: Math.abs((ingredient.protein - referenceValues.protein) / referenceValues.protein) * 100,
            carbs: Math.abs((ingredient.carbs - referenceValues.carbs) / referenceValues.carbs) * 100,
            fat: Math.abs((ingredient.fat - referenceValues.fat) / referenceValues.fat) * 100,
          }

          // Consider accurate if all major macros are within 10%
          const isAccurate = Object.values(accuracy).every((acc) => acc <= 10)

          results.push({
            ingredient: ingredient.name,
            id,
            ourValues: {
              calories: ingredient.calories,
              protein: ingredient.protein,
              carbs: ingredient.carbs,
              fat: ingredient.fat,
              fiber: ingredient.fiber,
              sugar: ingredient.sugar,
              sodium: ingredient.sodium,
            },
            referenceValues,
            accuracy,
            isAccurate,
            source: "USDA FoodData Central",
            confidence: bestMatch.confidence,
            fdcId: bestMatch.fdcId,
            dataType: bestMatch.dataType,
            needsVerification: !isAccurate,
          })

          verifiedCount++
          if (isAccurate) accurateCount++
          if (!isAccurate) needsVerificationCount++
        } else {
          results.push({
            ingredient: ingredient.name,
            id,
            status: "Not found in USDA database",
            needsVerification: true,
            ourValues: {
              calories: ingredient.calories,
              protein: ingredient.protein,
              carbs: ingredient.carbs,
              fat: ingredient.fat,
              fiber: ingredient.fiber,
              sugar: ingredient.sugar,
              sodium: ingredient.sodium,
            },
          })
          needsVerificationCount++
        }

        // Add delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error verifying ${ingredient.name}:`, error)
        results.push({
          ingredient: ingredient.name,
          id,
          status: "Verification Error",
          needsVerification: true,
          error: error instanceof Error ? error.message : "Unknown error",
        })
        needsVerificationCount++
      }
    }

    const summary = {
      totalIngredients: Object.keys(INGREDIENTS_DB).length,
      verifiedIngredients: verifiedCount,
      accurateIngredients: accurateCount,
      needsVerification: needsVerificationCount,
      dataSource: "USDA FoodData Central (Exclusive)",
      lastVerified: new Date().toISOString(),
    }

    return NextResponse.json({
      status: "success",
      summary,
      results: results.sort((a, b) => {
        // Sort by accuracy status
        if (a.isAccurate && !b.isAccurate) return -1
        if (!a.isAccurate && b.isAccurate) return 1
        return a.ingredient.localeCompare(b.ingredient)
      }),
      source: "USDA FoodData Central",
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        source: "USDA FoodData Central",
      },
      { status: 500 },
    )
  }
}
