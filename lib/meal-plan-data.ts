export interface Meal {
  name: string
  description: string
  calories: number
  image: string
}

export interface MealPlan {
  id: string // This is the slug, e.g., "weight-loss"
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  duration: string // e.g., "week"
  calories: string // e.g., "1200-1500"
  protein: string // e.g., "25-30g per meal"
  image: string
  heroImage: string
  features: string[]
  benefits: string[]
  sampleMeals: Meal[]
  tags: string[]
}

export const mealPlans: Record<string, MealPlan> = {
  "weight-loss": {
    id: "weight-loss",
    name: "Weight Loss Plan",
    description: "Calorie-controlled meals designed to help you lose weight while staying satisfied.",
    longDescription:
      "Our Weight Loss Plan is scientifically designed to create a sustainable caloric deficit while ensuring you get all the nutrients your body needs. Each meal is portion-controlled and packed with lean proteins, fiber-rich vegetables, and complex carbohydrates to keep you feeling full and energized throughout your weight loss journey.",
    price: 350,
    originalPrice: 420,
    duration: "week",
    calories: "1200-1500",
    protein: "25-30g per meal",
    image: "/vibrant-weight-loss-meal.png",
    heroImage: "/weight-loss-chicken-vegetables.png",
    features: [
      "Portion-controlled meals",
      "High protein content",
      "Low calorie density",
      "Fiber-rich vegetables",
      "Sustainable weight loss",
      "Nutritionist approved",
    ],
    benefits: [
      "Lose 1-2 lbs per week safely",
      "Maintain muscle mass",
      "Boost metabolism",
      "Reduce cravings",
      "Improve energy levels",
    ],
    sampleMeals: [
      {
        name: "Grilled Chicken & Quinoa Bowl",
        description: "Lean chicken breast with quinoa, roasted vegetables, and tahini dressing",
        calories: 420,
        image: "/grilled-chicken-vegetable-medley.png",
      },
      {
        name: "Mediterranean Salmon",
        description: "Herb-crusted salmon with Greek salad and lemon vinaigrette",
        calories: 380,
        image: "/pan-seared-salmon-quinoa.png",
      },
      {
        name: "Turkey & Veggie Wrap",
        description: "Whole wheat wrap with lean turkey, fresh vegetables, and hummus",
        calories: 350,
        image: "/fresh-tuna-avocado-wrap.png",
      },
    ],
    tags: ["Low Calorie", "High Protein"],
  },
  "muscle-gain": {
    id: "muscle-gain",
    name: "Muscle Gain Plan",
    description: "Protein-rich meals to support muscle growth and recovery after workouts.",
    longDescription:
      "Fuel your muscle-building goals with our high-protein Muscle Gain Plan. Each meal is carefully crafted to provide optimal protein timing and amino acid profiles to support muscle protein synthesis. Combined with complex carbohydrates for energy and healthy fats for hormone production.",
    price: 400,
    originalPrice: 480,
    duration: "week",
    calories: "2000-2500",
    protein: "35-45g per meal",
    image: "/hearty-muscle-meal.png",
    heroImage: "/hearty-muscle-meal-ribeye.png",
    features: [
      "High protein content",
      "Post-workout nutrition",
      "Lean muscle support",
      "Complex carbohydrates",
      "Optimal amino acids",
      "Performance focused",
    ],
    benefits: [
      "Build lean muscle mass",
      "Faster recovery",
      "Increased strength",
      "Better workout performance",
      "Enhanced metabolism",
    ],
    sampleMeals: [
      {
        name: "Ribeye Steak & Sweet Potato",
        description: "Grilled ribeye with roasted sweet potato and steamed broccoli",
        calories: 650,
        image: "/hearty-muscle-meal-ribeye.png",
      },
      {
        name: "Protein Power Bowl",
        description: "Chicken, quinoa, black beans, and avocado with cilantro lime dressing",
        calories: 580,
        image: "/chicken-quinoa-power-bowl.png",
      },
      {
        name: "Turkey Meatballs & Rice",
        description: "Lean turkey meatballs with brown rice and mixed vegetables",
        calories: 520,
        image: "/savory-turkey-meatballs.png",
      },
    ],
    tags: ["High Protein", "Performance"],
  },
  keto: {
    id: "keto",
    name: "Keto Plan",
    description: "Low-carb, high-fat meals designed to help you achieve and maintain ketosis.",
    longDescription:
      "Enter and maintain ketosis with our expertly crafted Keto Plan. Each meal contains less than 20g of net carbs while providing healthy fats and moderate protein to keep you in the fat-burning state. Perfect for those following a ketogenic lifestyle.",
    price: 380,
    originalPrice: 450,
    duration: "week",
    calories: "1600-2000",
    protein: "25-35g per meal",
    image: "/colorful-keto-plate.png",
    heroImage: "/keto-salmon-avocado.png",
    features: [
      "Under 20g net carbs",
      "High healthy fats",
      "Ketosis support",
      "MCT oil included",
      "Electrolyte balance",
      "Keto-friendly ingredients",
    ],
    benefits: ["Rapid fat loss", "Mental clarity", "Stable energy", "Reduced appetite", "Better sleep quality"],
    sampleMeals: [
      {
        name: "Salmon & Avocado Salad",
        description: "Grilled salmon with avocado, leafy greens, and olive oil dressing",
        calories: 480,
        image: "/keto-salmon-avocado.png",
      },
      {
        name: "Beef & Cauliflower Mash",
        description: "Grass-fed beef with cauliflower mash and sautéed spinach",
        calories: 520,
        image: "/classic-beef-broccoli.png",
      },
      {
        name: "Egg & Cheese Omelette",
        description: "Three-egg omelette with cheese, mushrooms, and herbs",
        calories: 420,
        image: "/fluffy-egg-white-omelette.png",
      },
    ],
    tags: ["Low Carb", "High Fat"],
  },
  "stay-fit": {
    id: "stay-fit",
    name: "Stay Fit Plan",
    description: "Balanced nutrition to maintain your weight and support an active lifestyle.",
    longDescription:
      "Maintain your ideal weight and support your active lifestyle with our balanced Stay Fit Plan. Each meal provides the perfect balance of macronutrients to fuel your workouts, support recovery, and maintain your current physique.",
    price: 320,
    originalPrice: 380,
    duration: "week",
    calories: "1800-2200",
    protein: "30-35g per meal",
    image: "/vibrant-nutrition-plate.png",
    heroImage: "/vibrant-meal-prep.png",
    features: [
      "Balanced macronutrients",
      "Maintenance calories",
      "Active lifestyle support",
      "Variety of cuisines",
      "Flexible portions",
      "Sustainable nutrition",
    ],
    benefits: [
      "Maintain current weight",
      "Support active lifestyle",
      "Consistent energy",
      "Nutritional balance",
      "Convenient meal prep",
    ],
    sampleMeals: [
      {
        name: "Chicken & Quinoa Bowl",
        description: "Grilled chicken with quinoa, roasted vegetables, and tahini sauce",
        calories: 520,
        image: "/chicken-quinoa-power-bowl.png",
      },
      {
        name: "Vegetable Stir Fry",
        description: "Mixed vegetables with tofu in a savory Asian-inspired sauce",
        calories: 450,
        image: "/vibrant-vegetable-stir-fry.png",
      },
      {
        name: "Protein Pancakes",
        description: "High-protein pancakes with berries and sugar-free syrup",
        calories: 380,
        image: "/fluffy-protein-stack.png",
      },
    ],
    tags: ["Balanced", "Maintenance"],
  },
}

export const allMealPlans: MealPlan[] = Object.values(mealPlans)
