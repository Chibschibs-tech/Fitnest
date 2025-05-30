import { calculateMealNutrition, type MealIngredient } from "@/lib/macro-calculator"

const mealPlans = {
  1: {
    id: 1,
    name: "Weight Loss Plan",
    description: "Perfect for those looking to shed some pounds while enjoying delicious meals.",
    weeklyPrice: 249,
    type: "weight_loss",
    caloriesMin: 1200,
    caloriesMax: 1500,
    active: true,
    planVariations: {
      1200: {
        name: "1200 Calorie Plan",
        dailyCalories: 1200,
        meals: [
          {
            id: 1,
            name: "Protein-Packed Breakfast Bowl",
            mealType: "breakfast",
            ingredients: [
              { ingredientId: "egg-whites", amount: 120, displayText: "4 egg whites (~120g)" },
              { ingredientId: "spinach", amount: 50, displayText: "1/2 cup fresh spinach (~50g)" },
              { ingredientId: "mushrooms", amount: 60, displayText: "1/2 cup sliced mushrooms (~60g)" },
              { ingredientId: "bell-peppers", amount: 40, displayText: "1/4 cup diced bell peppers (~40g)" },
              { ingredientId: "olive-oil", amount: 5, displayText: "1 tsp olive oil (~5g)" },
              { ingredientId: "avocado", amount: 30, displayText: "1/4 small avocado (~30g)" },
            ] as MealIngredient[],
            get nutrition() {
              return calculateMealNutrition(this.ingredients)
            },
            get calories() {
              return this.nutrition.calories
            },
            get protein() {
              return this.nutrition.protein
            },
            get carbs() {
              return this.nutrition.carbs
            },
            get fat() {
              return this.nutrition.fat
            },
            imageUrl: "/fluffy-egg-white-omelette.png",
            tags: ["high-protein", "low-carb", "vegetarian"],
            dietaryInfo: ["gluten-free", "vegetarian"],
            description: "A protein-rich breakfast bowl with fluffy egg whites and fresh vegetables.",
          },
          {
            id: 2,
            name: "Grilled Chicken & Vegetable Medley",
            mealType: "lunch",
            ingredients: [
              { ingredientId: "chicken-breast", amount: 120, displayText: "4 oz grilled chicken breast (~120g)" },
              { ingredientId: "broccoli", amount: 150, displayText: "1 cup steamed broccoli (~150g)" },
              { ingredientId: "carrots", amount: 80, displayText: "1/2 cup roasted carrots (~80g)" },
              { ingredientId: "zucchini", amount: 100, displayText: "1/2 cup grilled zucchini (~100g)" },
              { ingredientId: "quinoa-cooked", amount: 80, displayText: "1/3 cup cooked quinoa (~80g)" },
              { ingredientId: "olive-oil", amount: 8, displayText: "2 tsp olive oil (~8g)" },
            ] as MealIngredient[],
            get nutrition() {
              return calculateMealNutrition(this.ingredients)
            },
            get calories() {
              return this.nutrition.calories
            },
            get protein() {
              return this.nutrition.protein
            },
            get carbs() {
              return this.nutrition.carbs
            },
            get fat() {
              return this.nutrition.fat
            },
            imageUrl: "/grilled-chicken-vegetable-medley.png",
            tags: ["high-protein", "balanced"],
            dietaryInfo: ["gluten-free"],
            description: "Tender grilled chicken breast with a colorful mix of roasted vegetables and quinoa.",
          },
          {
            id: 3,
            name: "Pan-Seared Salmon with Asparagus",
            mealType: "dinner",
            ingredients: [
              { ingredientId: "salmon-fillet", amount: 100, displayText: "3.5 oz salmon fillet (~100g)" },
              { ingredientId: "asparagus", amount: 150, displayText: "6-8 asparagus spears (~150g)" },
              { ingredientId: "sweet-potato", amount: 120, displayText: "1 small roasted sweet potato (~120g)" },
              { ingredientId: "spinach", amount: 60, displayText: "2 cups fresh spinach (~60g)" },
              { ingredientId: "olive-oil", amount: 10, displayText: "2 tsp olive oil (~10g)" },
            ] as MealIngredient[],
            get nutrition() {
              return calculateMealNutrition(this.ingredients)
            },
            get calories() {
              return this.nutrition.calories
            },
            get protein() {
              return this.nutrition.protein
            },
            get carbs() {
              return this.nutrition.carbs
            },
            get fat() {
              return this.nutrition.fat
            },
            imageUrl: "/pan-seared-salmon-quinoa.png",
            tags: ["omega-3", "heart-healthy"],
            dietaryInfo: ["gluten-free", "pescatarian"],
            description: "Perfectly seared salmon with roasted sweet potato and fresh asparagus.",
          },
        ],
      },
    },
  },
}
