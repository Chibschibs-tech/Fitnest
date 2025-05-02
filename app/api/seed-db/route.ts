import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { mealPlans, meals } from "@/lib/db"

export async function GET() {
  try {
    // Add sample meal plans if none exist
    const mealPlanCount = await db.select({ count: sql`count(*)` }).from(mealPlans)

    if (mealPlanCount[0].count === 0) {
      await db.insert(mealPlans).values([
        {
          name: "Weight Loss Plan",
          description: "A calorie-controlled plan designed to help you lose weight steadily and healthily.",
          type: "weight_loss",
          caloriesMin: 1200,
          caloriesMax: 1500,
          price5Days: 45000, // 450 MAD
          price7Days: 59000, // 590 MAD
          isActive: true,
        },
        {
          name: "Balanced Nutrition",
          description: "A well-balanced plan with optimal macronutrient distribution for overall health.",
          type: "balanced",
          caloriesMin: 1800,
          caloriesMax: 2200,
          price5Days: 42000, // 420 MAD
          price7Days: 55000, // 550 MAD
          isActive: true,
        },
        {
          name: "Muscle Gain",
          description: "High protein meals to support muscle growth and recovery after workouts.",
          type: "muscle_gain",
          caloriesMin: 2500,
          caloriesMax: 3000,
          price5Days: 48000, // 480 MAD
          price7Days: 63000, // 630 MAD
          isActive: true,
        },
      ])
    }

    // Add sample meals if none exist
    const mealCount = await db.select({ count: sql`count(*)` }).from(meals)

    if (mealCount[0].count === 0) {
      await db.insert(meals).values([
        {
          name: "Grilled Chicken & Vegetable Medley",
          description: "Tender grilled chicken breast with a colorful mix of roasted vegetables.",
          calories: 450,
          protein: 35,
          carbs: 30,
          fat: 15,
          imageUrl: "/grilled-chicken-vegetable-medley.png",
          mealType: "lunch",
          tags: JSON.stringify(["high-protein", "low-carb"]),
          dietaryInfo: JSON.stringify(["gluten-free"]),
          isActive: true,
        },
        {
          name: "Rainbow Grain Bowl",
          description: "Nutrient-rich bowl with quinoa, roasted vegetables, avocado, and tahini dressing.",
          calories: 550,
          protein: 20,
          carbs: 65,
          fat: 22,
          imageUrl: "/rainbow-grain-bowl.png",
          mealType: "lunch",
          tags: JSON.stringify(["vegetarian", "high-fiber"]),
          dietaryInfo: JSON.stringify(["vegetarian", "dairy-free"]),
          isActive: true,
        },
        {
          name: "Chicken Quinoa Power Bowl",
          description: "Protein-packed bowl with grilled chicken, quinoa, black beans, and vegetables.",
          calories: 520,
          protein: 40,
          carbs: 45,
          fat: 18,
          imageUrl: "/chicken-quinoa-power-bowl.png",
          mealType: "dinner",
          tags: JSON.stringify(["high-protein", "balanced"]),
          dietaryInfo: JSON.stringify(["gluten-free"]),
          isActive: true,
        },
      ])
    }

    return NextResponse.json({
      status: "success",
      message: "Sample data added successfully",
      mealPlans: await db.select().from(mealPlans).limit(5),
      meals: await db.select().from(meals).limit(5),
    })
  } catch (error) {
    console.error("Database seeding failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// Helper function for SQL queries
function sql(strings, ...values) {
  return { text: strings.join("?"), values }
}
