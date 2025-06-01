import { calculateMealNutrition, type MealIngredient } from "@/lib/macro-calculator"

export default function MealPlanPage() {
  return (
    <div>
      {/* Meal plan details will go here */}
      Meal Plan Page
    </div>
  )
}

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
            type: "Breakfast",
            name: "Greek Yogurt Parfait",
            description: "Greek yogurt with berries, honey, and a sprinkle of granola",
            ingredients: [
              { ingredientId: "greek-yogurt-nonfat", amount: 150, displayText: "3/4 cup Greek yogurt (0% fat)" },
              { ingredientId: "blueberries", amount: 80, displayText: "1/2 cup fresh blueberries" },
              { ingredientId: "honey", amount: 15, displayText: "1 tablespoon honey" },
              { ingredientId: "granola", amount: 20, displayText: "2 tablespoons granola" },
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
            image: "/layered-berry-parfait.png",
          },
          {
            type: "Lunch",
            name: "Mashed Potato with Meatballs and Salad",
            description:
              "A comforting and balanced plate featuring creamy mashed potatoes, savory meatballs, and fresh salad",
            ingredients: [
              // Mashed Potato
              { ingredientId: "potato-russet", amount: 90, displayText: "90g potatoes (3/4 small potato)" },
              { ingredientId: "butter", amount: 8, displayText: "8g butter (1/2 tablespoon)" },
              { ingredientId: "milk-whole", amount: 25, displayText: "25ml milk (1.5 tablespoons)" },
              // Meatballs
              { ingredientId: "ground-beef-80-20", amount: 70, displayText: "70g ground beef" },
              { ingredientId: "breadcrumbs", amount: 7, displayText: "1 tablespoon breadcrumbs" },
              { ingredientId: "egg-whole", amount: 12, displayText: "1/4 large egg" },
              { ingredientId: "onion", amount: 15, displayText: "1/8 small onion, finely chopped" },
              { ingredientId: "garlic", amount: 1.5, displayText: "1/2 clove garlic, minced" },
              { ingredientId: "parsley", amount: 2, displayText: "1/2 tablespoon parsley" },
              { ingredientId: "olive-oil", amount: 7, displayText: "1/2 tablespoon olive oil (for cooking)" },
              // Salad
              { ingredientId: "lettuce-iceberg", amount: 60, displayText: "60g lettuce, chopped" },
              { ingredientId: "tomato", amount: 90, displayText: "1 small tomato, diced" },
              { ingredientId: "cucumber", amount: 75, displayText: "1/2 medium cucumber, sliced" },
              { ingredientId: "bell-peppers", amount: 25, displayText: "1/4 small bell pepper, chopped" },
              { ingredientId: "olive-oil", amount: 8, displayText: "1 tablespoon olive oil" },
              { ingredientId: "vinegar-balsamic", amount: 7, displayText: "1 tablespoon balsamic vinegar" },
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
            image: "/grilled-chicken-vegetable-medley.png",
          },
          {
            type: "Dinner",
            name: "Baked Salmon with Vegetables",
            description: "Herb-seasoned salmon fillet with roasted vegetables",
            ingredients: [
              { ingredientId: "salmon-fillet", amount: 100, displayText: "100g salmon fillet" },
              { ingredientId: "asparagus", amount: 150, displayText: "150g asparagus spears" },
              { ingredientId: "sweet-potato", amount: 120, displayText: "120g roasted sweet potato" },
              { ingredientId: "olive-oil", amount: 10, displayText: "2 teaspoons olive oil" },
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
            image: "/pan-seared-salmon-quinoa.png",
          },
        ],
      },
    },
  },
}
