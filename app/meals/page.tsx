"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Filter, Search, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { MealCard } from "./components/meal-card"
import { MealDetail } from "./components/meal-detail"

export const dynamic = "force-dynamic"

// Types
interface Meal {
  id: number
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  imageUrl: string
  tags: string[]
  mealType: string
  dietaryInfo: string[]
  planVariations?: {
    muscleGain: {
      calories: number
      protein: number
      carbs: number
      fat: number
      ingredients: string[]
    }
    weightLoss: {
      calories: number
      protein: number
      carbs: number
      fat: number
      ingredients: string[]
    }
    stayFit: {
      calories: number
      protein: number
      carbs: number
      fat: number
      ingredients: string[]
    }
  }
}

export default function MealsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([])
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [calorieRange, setCalorieRange] = useState<[number, number]>([0, 1200])
  const [sortOption, setSortOption] = useState("popular")
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)

  // Get the tab from URL params, but only once during initial render
  const initialTab = useMemo(() => {
    const type = searchParams.get("type")
    return type || "all"
  }, [searchParams])

  const [activeTab, setActiveTab] = useState(initialTab)

  // Fetch meals data
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const mockMeals: Meal[] = [
          {
            id: 1,
            name: "Mashed Potato with Meatballs and Salad",
            description:
              "A comforting and balanced plate featuring creamy mashed potatoes, savory meatballs, and fresh salad. A nutritious meal that satisfies both taste and nutritional needs.",
            calories: 800,
            protein: 45,
            carbs: 65,
            fat: 25,
            imageUrl: "/mashed-potato-meatballs.png",
            tags: ["high-protein", "balanced", "comfort-food"],
            mealType: "main",
            dietaryInfo: ["gluten-free-option"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 55,
                carbs: 80,
                fat: 30,
                ingredients: [
                  "Mashed Potato Ingredients (for ~260g):",
                  "Potatoes: 260 grams (2 medium potatoes)",
                  "Butter: 25 grams (1½ tablespoons)",
                  "Milk or cream: 75 ml (5 tablespoons)",
                  "Salt and pepper: to taste",
                  "Meatball Ingredients (for 4–5 meatballs):",
                  "Ground beef: 200 grams",
                  "Breadcrumbs: 2½ tablespoons",
                  "Egg: 1 large egg",
                  "Onion: ¼ small, finely chopped",
                  "Garlic: 1 clove, minced",
                  "Parsley (optional): 1 tablespoon, chopped",
                  "Salt and pepper: to taste",
                  "Olive oil: 1 tablespoon (for cooking)",
                  "Salad Ingredients (for 100g of mixed vegetables):",
                  "Lettuce: 60 grams, chopped",
                  "Tomato: 1 small, diced",
                  "Cucumber: ½ medium, sliced",
                  "Bell pepper: ¼ small, chopped",
                  "Olive oil and vinegar dressing: 1 tablespoon",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 35,
                carbs: 45,
                fat: 15,
                ingredients: [
                  "Mashed Potato Ingredients (for ~90g):",
                  "Potatoes: 90 grams (¾ small potato)",
                  "Butter: 8 grams (½ tablespoon)",
                  "Milk or cream: 25 ml (1½ tablespoons)",
                  "Salt and pepper: to taste",
                  "Meatball Ingredients (for ~1–2 meatballs):",
                  "Ground beef: 70 grams",
                  "Breadcrumbs: 1 tablespoon",
                  "Egg: ¼ large egg",
                  "Onion: ⅛ small, finely chopped",
                  "Garlic: ½ clove, minced",
                  "Parsley (optional): ½ tablespoon, chopped",
                  "Salt and pepper: to taste",
                  "Olive oil: ½ tablespoon (for cooking)",
                  "Salad Ingredients (for 100g of mixed vegetables):",
                  "Lettuce: 60 grams, chopped",
                  "Tomato: 1 small, diced",
                  "Cucumber: ½ medium, sliced",
                  "Bell pepper: ¼ small, chopped",
                  "Olive oil and vinegar dressing: 1 tablespoon",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 40,
                carbs: 55,
                fat: 20,
                ingredients: [
                  "Mashed Potato Ingredients (for ~135g):",
                  "Potatoes: 135 grams (1 small potato)",
                  "Butter: 12 grams (1 tablespoon)",
                  "Milk or cream: 35 ml (2 tablespoons)",
                  "Salt and pepper: to taste",
                  "Meatball Ingredients (for ~2–3 meatballs):",
                  "Ground beef: 105 grams",
                  "Breadcrumbs: 1½ tablespoons",
                  "Egg: ⅓ large egg",
                  "Onion: ⅙ small, finely chopped",
                  "Garlic: ⅔ clove, minced",
                  "Parsley (optional): ⅔ tablespoon, chopped",
                  "Salt and pepper: to taste",
                  "Olive oil: ⅔ tablespoon (for cooking)",
                  "Salad Ingredients (for 100g of mixed vegetables):",
                  "Lettuce: 60 grams, chopped",
                  "Tomato: 1 small, diced",
                  "Cucumber: ½ medium, sliced",
                  "Bell pepper: ¼ small, chopped",
                  "Olive oil and vinegar dressing: 1 tablespoon",
                ],
              },
            },
          },
          {
            id: 2,
            name: "Rice with Grilled Fish and Salad",
            description:
              "Perfectly grilled fish served with fluffy rice and a crisp fresh salad. A light yet satisfying meal that balances lean protein and aromatic rice with nutritional vegetables.",
            calories: 750,
            protein: 42,
            carbs: 70,
            fat: 18,
            imageUrl: "/rice-grilled-fish-salad.png",
            tags: ["high-protein", "omega-3", "light"],
            mealType: "main",
            dietaryInfo: ["gluten-free", "dairy-free"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 50,
                carbs: 85,
                fat: 25,
                ingredients: [
                  "Rice Ingredients (for ~180g cooked):",
                  "White or brown rice: 75 grams (½ cup uncooked)",
                  "Water or broth: 1½ cups",
                  "Grilled Fish Ingredients (for ~1 fillet):",
                  "Fish fillet (e.g., cod, tilapia, or sea bass): 100 grams",
                  "Olive oil: ½ tablespoon (for grilling)",
                  "Lemon juice: 2 teaspoons",
                  "Garlic: ½ clove, minced",
                  "Salt, pepper, and herbs: to taste",
                  "Mixed greens (e.g., baby of mixed greens):",
                  "Mixed greens: 65 grams",
                  "Tomato: 1 small, diced",
                  "Cucumber: ½ medium, sliced",
                  "Cumin: ¼ small, shredded or sliced",
                  "Salad dressing: 2 teaspoons (olive oil and lemon)",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 35,
                carbs: 50,
                fat: 12,
                ingredients: [
                  "Rice Ingredients (for ~180g cooked):",
                  "White or brown rice: 75 grams (⅓ cup uncooked)",
                  "Water or broth: 1½ cups",
                  "Grilled Fish Ingredients (for ~1 fillet):",
                  "Fish fillet (e.g., cod, tilapia, or sea bass): 100 grams",
                  "Olive oil: ½ tablespoon (for grilling)",
                  "Lemon juice: 2 teaspoons",
                  "Garlic: ½ clove, minced",
                  "Salt, pepper, and herbs: to taste",
                  "Mixed greens (e.g., baby of mixed greens):",
                  "Mixed greens: 65 grams",
                  "Tomato: 1 small, diced",
                  "Cucumber: ½ medium, sliced",
                  "Cumin: ¼ small, shredded or sliced",
                  "Salad dressing: 2 teaspoons (olive oil and lemon)",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 40,
                carbs: 65,
                fat: 15,
                ingredients: [
                  "Rice Ingredients (for ~180g cooked):",
                  "White or brown rice: 75 grams (½ cup uncooked)",
                  "Water or broth: 1½ cups",
                  "Grilled Fish Ingredients (for ~1 fillet):",
                  "Fish fillet (e.g., cod, tilapia, or sea bass): 100 grams",
                  "Olive oil: ½ tablespoon (for grilling)",
                  "Lemon juice: 2 teaspoons",
                  "Garlic: ½ clove, minced",
                  "Salt, pepper, and herbs: to taste",
                  "Mixed greens (e.g., baby of mixed greens):",
                  "Mixed greens: 65 grams",
                  "Tomato: 1 small, diced",
                  "Cucumber: ½ medium, sliced",
                  "Cumin: ¼ small, shredded or sliced",
                  "Salad dressing: 2 teaspoons (olive oil and lemon)",
                ],
              },
            },
          },
          {
            id: 3,
            name: "Chicken Breast with Roasted Veggies and Mashed Potato",
            description:
              "Juicy grilled chicken breast, oven-roasted seasonal vegetables, and smooth mashed potatoes. A complete and flavorful meal without compromise.",
            calories: 800,
            protein: 48,
            carbs: 60,
            fat: 22,
            imageUrl: "/chicken-roasted-veggies-potato.png",
            tags: ["high-protein", "balanced", "roasted"],
            mealType: "main",
            dietaryInfo: ["gluten-free"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 55,
                carbs: 75,
                fat: 28,
                ingredients: [
                  "Chicken Breast Ingredients (for 150-200g):",
                  "Chicken breast: meat-standard, boneless and skinless",
                  "Olive oil: 1 tablespoon (for cooking)",
                  "Garlic: ½ clove, minced",
                  "Salt and pepper: to taste",
                  "Roasted Veggies Ingredients (for 150-200g):",
                  "Carrots: 50 grams, chopped",
                  "Bell peppers: 50 grams, chopped",
                  "Zucchini: 50 grams, chopped",
                  "Olive oil: 1 tablespoon (for roasting)",
                  "Herbs (rosemary, thyme): to taste",
                  "Mashed Potato Ingredients (for 200-250g):",
                  "Potatoes: 200-250 grams (2 medium potatoes)",
                  "Milk or cream: 50-70 ml (⅓ cup)",
                  "Salt and pepper: to taste",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 40,
                carbs: 40,
                fat: 15,
                ingredients: [
                  "Chicken Breast Ingredients (for 120g):",
                  "Chicken breast: meat-standard, boneless and skinless",
                  "Olive oil: ½ tablespoon (for cooking)",
                  "Garlic: ¼ clove, minced",
                  "Salt and pepper: to taste",
                  "Roasted Veggies Ingredients (for 120g):",
                  "Carrots: 40 grams, chopped",
                  "Bell peppers: 40 grams, chopped",
                  "Zucchini: 40 grams, chopped",
                  "Olive oil: ½ tablespoon (for roasting)",
                  "Herbs (rosemary, thyme): to taste",
                  "Mashed Potato Ingredients (for 150g):",
                  "Potatoes: 150 grams (1 medium potato)",
                  "Milk or cream: 30-40 ml (3 tablespoons)",
                  "Salt and pepper: to taste",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 45,
                carbs: 55,
                fat: 18,
                ingredients: [
                  "Chicken Breast Ingredients (for 150g):",
                  "Chicken breast: meat-standard, boneless and skinless",
                  "Olive oil: ¾ tablespoon (for cooking)",
                  "Garlic: ⅓ clove, minced",
                  "Salt and pepper: to taste",
                  "Roasted Veggies Ingredients (for 135g):",
                  "Carrots: 45 grams, chopped",
                  "Bell peppers: 45 grams, chopped",
                  "Zucchini: 45 grams, chopped",
                  "Olive oil: ¾ tablespoon (for roasting)",
                  "Herbs (rosemary, thyme): to taste",
                  "Mashed Potato Ingredients (for 175g):",
                  "Potatoes: 175 grams (1½ medium potatoes)",
                  "Milk or cream: 40-50 ml (4 tablespoons)",
                  "Salt and pepper: to taste",
                ],
              },
            },
          },
          {
            id: 4,
            name: "Grilled Salmon with Greens and Rice",
            description:
              "Rich, flaky grilled salmon fillet served with aromatic rice and steamed leafy greens. An aromatic clean, classic meal that balances fish, heart-healthy nutrients, and recovery food.",
            calories: 820,
            protein: 45,
            carbs: 65,
            fat: 25,
            imageUrl: "/grilled-salmon-greens-rice.png",
            tags: ["omega-3", "high-protein", "premium"],
            mealType: "main",
            dietaryInfo: ["gluten-free", "dairy-free"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 52,
                carbs: 80,
                fat: 30,
                ingredients: [
                  "Grilled Salmon Ingredients (for 200g):",
                  "Salmon fillet: 200 grams",
                  "Olive oil: 1 tablespoon (for grilling)",
                  "Lemon juice: 1 tablespoon",
                  "Salt, pepper, and dill: to taste",
                  "Greens Ingredients (for 100g):",
                  "Mixed greens (e.g., spinach, arugula, kale): 100 grams",
                  "Olive oil and vinegar dressing: 1 tablespoon",
                  "Rice Ingredients (for 200g cooked):",
                  "White or brown rice: 140 grams (¾ cup uncooked)",
                  "Water or broth: 2 cups",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 38,
                carbs: 45,
                fat: 18,
                ingredients: [
                  "Grilled Salmon Ingredients (for ~130g):",
                  "Salmon fillet: 130 grams",
                  "Olive oil: ½ tablespoon (for grilling)",
                  "Lemon juice: 1 teaspoon",
                  "Salt, pepper, and dill: to taste",
                  "Greens Ingredients (for ~70g):",
                  "Mixed greens (e.g., spinach, arugula, kale): 70 grams",
                  "Olive oil and vinegar dressing: 1 tablespoon",
                  "Rice Ingredients (for ~140g cooked):",
                  "White or brown rice: 80 grams (½ cup uncooked)",
                  "Water or broth: 1 cup",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 42,
                carbs: 60,
                fat: 22,
                ingredients: [
                  "Grilled Salmon Ingredients (for ~170g):",
                  "Salmon fillet: 170 grams",
                  "Olive oil: ¾ tablespoon (for grilling)",
                  "Lemon juice: 2 teaspoons",
                  "Salt, pepper, and dill: to taste",
                  "Greens Ingredients (for ~85g):",
                  "Mixed greens (e.g., spinach, arugula, kale): 85 grams",
                  "Olive oil and vinegar dressing: 2 tablespoons",
                  "Rice Ingredients (for ~160g cooked):",
                  "White or brown rice: 100 grams (⅔ cup uncooked)",
                  "Water or broth: 1½ cups",
                ],
              },
            },
          },
          {
            id: 5,
            name: "Quesadillas with Chicken, Guacamole, and Salsa",
            description:
              "Lightly grilled tortillas filled with tender chicken and melted cheese, creamy guacamole, and fresh salsa. Mexican-inspired gourmet that's full of flavor and perfectly balanced.",
            calories: 780,
            protein: 38,
            carbs: 55,
            fat: 30,
            imageUrl: "/chicken-quesadillas.png",
            tags: ["mexican-inspired", "cheese", "flavorful"],
            mealType: "main",
            dietaryInfo: ["gluten-free-option"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 50,
                carbs: 70,
                fat: 40,
                ingredients: [
                  "Quesadilla Ingredients:",
                  "Whole wheat tortillas: 2 (50g each)",
                  "Cooked chicken breast: 150 grams, shredded",
                  "Shredded cheese (cheddar or mozzarella): 70 grams",
                  "Olive oil: 1 tablespoon (for cooking)",
                  "Guacamole Ingredients (for ~75g):",
                  "Avocado: ½ small, mashed",
                  "Lime juice: ½ teaspoon",
                  "Salt and pepper: to taste",
                  "Salsa Ingredients (for ~60g):",
                  "Tomato: 1 small, diced",
                  "Onion: ¼ small, diced",
                  "Cilantro: 1 tablespoon, chopped",
                  "Lime juice: ½ teaspoon",
                  "Salt and pepper: to taste",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 30,
                carbs: 40,
                fat: 20,
                ingredients: [
                  "Quesadilla Ingredients:",
                  "Whole wheat tortillas: 1 (50g)",
                  "Cooked chicken breast: 80 grams, shredded",
                  "Shredded cheese (cheddar or mozzarella): 30 grams",
                  "Olive oil: ½ tablespoon (for cooking)",
                  "Guacamole Ingredients (for ~30g):",
                  "Avocado: ¼ small, mashed",
                  "Lime juice: ¼ teaspoon",
                  "Salt and pepper: to taste",
                  "Salsa Ingredients (for ~40g):",
                  "Tomato: ½ small, diced",
                  "Onion: ⅛ small, diced",
                  "Cilantro: ½ tablespoon, chopped",
                  "Lime juice: ¼ teaspoon",
                  "Salt and pepper: to taste",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 35,
                carbs: 50,
                fat: 25,
                ingredients: [
                  "Quesadilla Ingredients:",
                  "Whole wheat tortillas: 2 (50g each)",
                  "Cooked chicken breast: 100 grams, shredded",
                  "Shredded cheese (cheddar or mozzarella): 50 grams",
                  "Olive oil: ¾ tablespoon (for cooking)",
                  "Guacamole Ingredients (for ~50g):",
                  "Avocado: ⅓ small, mashed",
                  "Lime juice: ⅓ teaspoon",
                  "Salt and pepper: to taste",
                  "Salsa Ingredients (for ~50g):",
                  "Tomato: ¾ small, diced",
                  "Onion: ⅙ small, diced",
                  "Cilantro: ¾ tablespoon, chopped",
                  "Lime juice: ⅓ teaspoon",
                  "Salt and pepper: to taste",
                ],
              },
            },
          },
          {
            id: 6,
            name: "Stuffed Pepper with Rice and Mixed Meat + Veggie Salad",
            description:
              "A hearty roasted stuffed pepper with a savory blend of rice and lean mixed meat, served with a colorful vegetable salad. Nutritious, filling, and vibrant.",
            calories: 750,
            protein: 35,
            carbs: 65,
            fat: 22,
            imageUrl: "/stuffed-pepper-salad.png",
            tags: ["stuffed", "hearty", "colorful"],
            mealType: "main",
            dietaryInfo: ["gluten-free"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 45,
                carbs: 85,
                fat: 30,
                ingredients: [
                  "Stuffed Pepper Ingredients (for ~1 small stuffed pepper):",
                  "Bell pepper: 1 small (≈150 grams)",
                  "Cooked rice: 80 grams (⅓ cup cooked, ~30g uncooked)",
                  "Ground beef or pork: 75 grams",
                  "Onion: ¼ medium, diced",
                  "Garlic: 1 clove, minced",
                  "Tomato sauce: 30 grams (≈2 tbsp)",
                  "Olive oil: 1 tablespoon (for sautéing)",
                  "Salt, pepper, and herbs: to taste",
                  "Veggie Salad Ingredients (for 100g):",
                  "Lettuce: 50 grams, chopped",
                  "Tomato: 1 small, diced",
                  "Cucumber: ½ medium, sliced",
                  "Olive oil and vinegar dressing: 1 tablespoon",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 25,
                carbs: 50,
                fat: 15,
                ingredients: [
                  "Stuffed Pepper Ingredients (for ~1 small stuffed pepper):",
                  "Bell pepper: 1 small (≈150 grams)",
                  "Cooked rice: 40 grams (⅕ cup cooked, ~20g uncooked)",
                  "Ground beef or pork: 40 grams",
                  "Onion: ⅛ medium, diced",
                  "Garlic: ½ clove, minced",
                  "Tomato sauce: 15 grams (≈½ tbsp)",
                  "Olive oil: ½ tablespoon (for sautéing)",
                  "Salt, pepper, and herbs: to taste",
                  "Veggie Salad Ingredients (for 100g):",
                  "Lettuce: 50 grams, chopped",
                  "Tomato: 1 small, diced",
                  "Cucumber: ½ medium, sliced",
                  "Olive oil and vinegar dressing: 1 tablespoon",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 32,
                carbs: 60,
                fat: 18,
                ingredients: [
                  "Stuffed Pepper Ingredients (for ~1 medium stuffed pepper):",
                  "Bell pepper: 1 medium (≈200 grams)",
                  "Cooked rice: 60 grams (¼ cup cooked, ~25g uncooked)",
                  "Ground beef or pork: 110 grams",
                  "Onion: ⅕ medium, diced",
                  "Garlic: ¾ clove, minced",
                  "Tomato sauce: 20 grams (≈¾ tbsp)",
                  "Olive oil: ¾ tablespoon (for sautéing)",
                  "Salt, pepper, and herbs: to taste",
                  "Veggie Salad Ingredients (for 100g):",
                  "Lettuce: 50 grams, chopped",
                  "Tomato: 1 small, diced",
                  "Cucumber: ½ medium, sliced",
                  "Olive oil and vinegar dressing: 1 tablespoon",
                ],
              },
            },
          },
          {
            id: 7,
            name: "Grilled Chicken Salad",
            description:
              "Slices of grilled chicken breast on a bed of crunchy greens, cherry tomatoes, carrots, and light vinaigrette. High in protein yet low-calorie – the perfect delicious choice.",
            calories: 650,
            protein: 40,
            carbs: 35,
            fat: 18,
            imageUrl: "/grilled-chicken-salad.png",
            tags: ["high-protein", "light", "fresh"],
            mealType: "main",
            dietaryInfo: ["gluten-free", "dairy-free"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 55,
                carbs: 50,
                fat: 25,
                ingredients: [
                  "Grilled Chicken Breast: 200 grams",
                  "Mixed greens (lettuce, spinach, arugula, or mesclun): 100 grams",
                  "Cherry tomatoes: 60 grams",
                  "Cucumber: 60 grams",
                  "Shredded carrots: 40 grams",
                  "Sliced almonds: 30 grams",
                  "Balsamic vinaigrette dressing (on the side): 2 tablespoons (30ml)",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 35,
                carbs: 25,
                fat: 12,
                ingredients: [
                  "Grilled Chicken Breast: 120 grams",
                  "Mixed greens (lettuce, spinach, arugula, or mesclun): 110 grams",
                  "Cherry tomatoes: 40 grams",
                  "Cucumber: 40 grams",
                  "Shredded carrots: 25 grams",
                  "Sliced almonds: 10 grams",
                  "Balsamic vinaigrette dressing (on the side): 1 tablespoon (15ml)",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 45,
                carbs: 32,
                fat: 15,
                ingredients: [
                  "Grilled Chicken Breast: 150 grams",
                  "Mixed greens (lettuce, spinach, arugula, or mesclun): 105 grams",
                  "Cherry tomatoes: 50 grams",
                  "Cucumber: 50 grams",
                  "Shredded carrots: 30 grams",
                  "Sliced almonds: 20 grams",
                  "Balsamic vinaigrette dressing (on the side): 2 tablespoons (30ml)",
                ],
              },
            },
          },
          // Add these breakfast meals to the existing mockMeals array
          {
            id: 8,
            name: "Turkey and Spinach Wrap",
            description:
              "A nutritious whole wheat wrap filled with lean turkey breast, fresh spinach, creamy avocado, and Greek yogurt spread. Perfect for a protein-rich start to your day.",
            calories: 750,
            protein: 35,
            carbs: 45,
            fat: 20,
            imageUrl: "/turkey-spinach-wrap.png",
            tags: ["high-protein", "wrap", "lean"],
            mealType: "breakfast",
            dietaryInfo: ["dairy-free-option"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 45,
                carbs: 60,
                fat: 25,
                ingredients: [
                  "Whole wheat tortilla: 1½ large (~150g)",
                  "Sliced turkey breast: 150 grams",
                  "Spinach: 60 grams",
                  "Avocado: 75 grams, sliced",
                  "Greek yogurt: 40 grams, as a spread",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 25,
                carbs: 35,
                fat: 15,
                ingredients: [
                  "Whole wheat tortilla: ½ large (~50g)",
                  "Sliced turkey breast: 80 grams",
                  "Spinach: 40 grams",
                  "Avocado: 30 grams, sliced",
                  "Greek yogurt: 20 grams, as a spread",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 32,
                carbs: 42,
                fat: 18,
                ingredients: [
                  "Whole wheat tortilla: 1 large (~70g)",
                  "Sliced turkey breast: 100 grams",
                  "Spinach: 50 grams",
                  "Avocado: 50 grams, sliced",
                  "Greek yogurt: 30 grams, as a spread",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          {
            id: 9,
            name: "Breakfast Egg and Avocado Toast",
            description:
              "Toasted whole grain bread topped with perfectly cooked eggs, creamy avocado slices, and fresh cherry tomatoes. A classic breakfast that delivers sustained energy.",
            calories: 680,
            protein: 28,
            carbs: 45,
            fat: 22,
            imageUrl: "/egg-avocado-toast.png",
            tags: ["eggs", "avocado", "toast"],
            mealType: "breakfast",
            dietaryInfo: ["vegetarian"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 38,
                carbs: 65,
                fat: 30,
                ingredients: [
                  "Whole grain bread: 3 slices (~120g)",
                  "Eggs: 3 large (~150g total)",
                  "Avocado: 125 grams, mashed",
                  "Cherry tomatoes: 80 grams, halved",
                  "Olive oil: 1 tablespoon (15g), drizzled",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 22,
                carbs: 30,
                fat: 18,
                ingredients: [
                  "Whole grain bread: 1 slice (~40g)",
                  "Eggs: 1 large (~50g)",
                  "Avocado: 50 grams, mashed",
                  "Cherry tomatoes: 40 grams, halved",
                  "Olive oil: 1 teaspoon (5g), drizzled",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 30,
                carbs: 40,
                fat: 20,
                ingredients: [
                  "Whole grain bread: 2 slices (~80g)",
                  "Eggs: 2 large (~100g total)",
                  "Avocado: 100 grams, mashed",
                  "Cherry tomatoes: 60 grams, halved",
                  "Olive oil: 1 tablespoon (10g), drizzled",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          {
            id: 10,
            name: "Overnight Oats",
            description:
              "Creamy overnight oats with Greek yogurt, mixed berries, and chia seeds. Prepared the night before for a convenient, nutritious breakfast that's ready when you wake up.",
            calories: 620,
            protein: 25,
            carbs: 55,
            fat: 18,
            imageUrl: "/overnight-oats.png",
            tags: ["oats", "berries", "make-ahead"],
            mealType: "breakfast",
            dietaryInfo: ["vegetarian", "gluten-free-option"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 35,
                carbs: 80,
                fat: 25,
                ingredients: [
                  "Rolled oats: 75 grams",
                  "Greek yogurt: 150 grams",
                  "Mixed berries: 75 grams",
                  "Chia seeds: 15 grams",
                  "Honey or maple syrup (optional): 15 grams",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 20,
                carbs: 40,
                fat: 12,
                ingredients: [
                  "Rolled oats: 40 grams",
                  "Greek yogurt: 125 grams",
                  "Mixed berries: 40 grams",
                  "Chia seeds: 10 grams",
                  "Honey or maple syrup (optional): 5 grams",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 28,
                carbs: 50,
                fat: 15,
                ingredients: [
                  "Rolled oats: 50 grams",
                  "Greek yogurt: 150 grams",
                  "Mixed berries: 50 grams",
                  "Chia seeds: 10 grams",
                  "Honey or maple syrup (optional): 10 grams",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          {
            id: 11,
            name: "Greek Yogurt Parfait",
            description:
              "Layers of creamy Greek yogurt, crunchy granola with nuts, fresh mixed berries, and chia seeds. A protein-packed breakfast that satisfies your sweet tooth naturally.",
            calories: 650,
            protein: 30,
            carbs: 50,
            fat: 20,
            imageUrl: "/greek-yogurt-parfait.png",
            tags: ["yogurt", "granola", "berries"],
            mealType: "breakfast",
            dietaryInfo: ["vegetarian", "gluten-free-option"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 40,
                carbs: 75,
                fat: 28,
                ingredients: [
                  "Greek yogurt: 200 grams",
                  "Granola (with nuts): 50 grams",
                  "Mixed berries: 75 grams",
                  "Chia seeds: 40 grams",
                  "Milk (plant-based): 200 grams",
                  "Honey or maple syrup (optional): 15 grams",
                  "Mixed fruit or nuts (topping): 75 grams",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 25,
                carbs: 35,
                fat: 15,
                ingredients: [
                  "Greek yogurt: 125 grams",
                  "Granola (with nuts): 20 grams",
                  "Mixed berries: 40 grams",
                  "Chia seeds: 20 grams",
                  "Milk (plant-based): 150 grams",
                  "Honey or maple syrup (optional): 5 grams",
                  "Mixed fruit or nuts (topping): 30 grams",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 32,
                carbs: 45,
                fat: 18,
                ingredients: [
                  "Greek yogurt: 150 grams",
                  "Granola (with nuts): 30 grams",
                  "Mixed berries: 50 grams",
                  "Chia seeds: 30 grams",
                  "Milk (plant-based): 150 grams",
                  "Honey or maple syrup (optional): 10 grams",
                  "Mixed fruit or nuts (topping): 50 grams",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          {
            id: 12,
            name: "Chia Seed Pudding",
            description:
              "Rich and creamy chia seed pudding made with plant-based milk, topped with fresh fruits and nuts. A superfood breakfast that's both indulgent and nutritious.",
            calories: 580,
            protein: 22,
            carbs: 40,
            fat: 25,
            imageUrl: "/chia-seed-pudding.png",
            tags: ["chia", "pudding", "superfood"],
            mealType: "breakfast",
            dietaryInfo: ["vegan", "gluten-free"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 35,
                carbs: 70,
                fat: 35,
                ingredients: [
                  "Chia seeds: 40 grams",
                  "Milk (plant-based): 200 grams",
                  "Honey or maple syrup (optional): 15 grams",
                  "Mixed fruit or nuts (topping): 75 grams",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 18,
                carbs: 30,
                fat: 20,
                ingredients: [
                  "Chia seeds: 20 grams",
                  "Milk (plant-based): 150 grams",
                  "Honey or maple syrup (optional): 5 grams",
                  "Mixed fruit or nuts (topping): 30 grams",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 25,
                carbs: 45,
                fat: 25,
                ingredients: [
                  "Chia seeds: 30 grams",
                  "Milk (plant-based): 150 grams",
                  "Honey or maple syrup (optional): 10 grams",
                  "Mixed fruit or nuts (topping): 50 grams",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          {
            id: 13,
            name: "Banana Bread Oatmeal",
            description:
              "Warm and comforting steel-cut oats with the flavors of banana bread. Made with rice banana, cinnamon, and a touch of natural sweetener for a cozy breakfast experience.",
            calories: 620,
            protein: 18,
            carbs: 65,
            fat: 15,
            imageUrl: "/banana-bread-oatmeal.png",
            tags: ["oatmeal", "banana", "comfort-food"],
            mealType: "breakfast",
            dietaryInfo: ["vegetarian", "gluten-free-option"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 25,
                carbs: 85,
                fat: 20,
                ingredients: [
                  "Steel-cut oats: 75 grams",
                  "Rice banana: 150 grams (1½ bananas)",
                  "Cinnamon: 5 grams",
                  "Honey or maple syrup (optional): 15 grams",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 15,
                carbs: 50,
                fat: 12,
                ingredients: [
                  "Steel-cut oats: 40 grams",
                  "Rice banana: 80 grams (about ½ banana)",
                  "Cinnamon: 3 grams",
                  "Honey or maple syrup (optional): 5 grams",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 20,
                carbs: 70,
                fat: 15,
                ingredients: [
                  "Steel-cut oats: 50 grams",
                  "Rice banana: 100 grams (1 medium banana)",
                  "Cinnamon: 5 grams",
                  "Honey or maple syrup (optional): 10 grams",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          {
            id: 14,
            name: "Breakfast Burrito",
            description:
              "A hearty breakfast burrito packed with turkey sausage, black beans, bell peppers, and cheese wrapped in a whole wheat tortilla. Perfect for busy mornings on the go.",
            calories: 720,
            protein: 32,
            carbs: 55,
            fat: 25,
            imageUrl: "/breakfast-burrito.png",
            tags: ["burrito", "protein-packed", "on-the-go"],
            mealType: "breakfast",
            dietaryInfo: ["high-protein"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 45,
                carbs: 75,
                fat: 35,
                ingredients: [
                  "Whole wheat tortillas: 2 large (each ≈ 100g)",
                  "Cooked turkey sausage: 130 grams",
                  "Black beans: 70 grams",
                  "Diced bell peppers: 40 grams",
                  "Shredded cheese: 40 grams",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 25,
                carbs: 40,
                fat: 18,
                ingredients: [
                  "Whole wheat tortilla: 1 small (~45g)",
                  "Cooked turkey sausage: 70 grams",
                  "Black beans: 40 grams",
                  "Diced bell peppers: 25 grams",
                  "Shredded cheese: 20 grams",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 35,
                carbs: 50,
                fat: 22,
                ingredients: [
                  "Whole wheat tortillas: 2 medium (~50g each ≈ 100g)",
                  "Cooked turkey sausage: 100 grams",
                  "Black beans: 50 grams",
                  "Diced bell peppers: 30 grams",
                  "Shredded cheese: 30 grams",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          {
            id: 15,
            name: "Peanut Butter Banana Overnight Oats",
            description:
              "Creamy overnight oats with rich peanut butter, sweet banana, and a hint of cocoa. Prepare the night before for a delicious, protein-rich breakfast that's ready when you wake up.",
            calories: 680,
            protein: 25,
            carbs: 60,
            fat: 22,
            imageUrl: "/peanut-butter-banana-oats.png",
            tags: ["peanut-butter", "banana", "overnight"],
            mealType: "breakfast",
            dietaryInfo: ["vegetarian", "gluten-free-option"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 35,
                carbs: 80,
                fat: 30,
                ingredients: [
                  "Rolled oats: 70 grams",
                  "Peanut butter: 40 grams",
                  "Rice banana: 150 grams",
                  "Cocoa powder or chocolate chips: 15 grams",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 20,
                carbs: 45,
                fat: 18,
                ingredients: [
                  "Rolled oats: 35 grams",
                  "Peanut butter: 20 grams",
                  "Rice banana: 80 grams",
                  "Cocoa powder or chocolate chips: 5 grams",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 28,
                carbs: 55,
                fat: 20,
                ingredients: [
                  "Rolled oats: 50 grams",
                  "Peanut butter: 30 grams",
                  "Rice banana: 100 grams",
                  "Cocoa powder or chocolate chips: 10 grams",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          {
            id: 16,
            name: "Yogurt and Fruit Bowl",
            description:
              "A vibrant bowl of creamy Greek yogurt topped with fresh mixed berries, tropical fruits like kiwi and mango, and crunchy granola or nuts for the perfect balance of flavors and textures.",
            calories: 650,
            protein: 28,
            carbs: 55,
            fat: 20,
            imageUrl: "/yogurt-fruit-bowl.png",
            tags: ["yogurt", "fresh-fruit", "colorful"],
            mealType: "breakfast",
            dietaryInfo: ["vegetarian", "gluten-free-option"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 40,
                carbs: 75,
                fat: 28,
                ingredients: [
                  "Greek yogurt: 200 grams",
                  "Mixed berries: 75 grams",
                  "Sliced fruits (kiwi, mango, etc.): 75 grams",
                  "Granola or nuts: 30 grams",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 22,
                carbs: 40,
                fat: 15,
                ingredients: [
                  "Greek yogurt: 125 grams",
                  "Mixed berries: 50 grams",
                  "Sliced fruits (kiwi, mango, etc.): 50 grams",
                  "Granola or nuts: 20 grams",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 30,
                carbs: 50,
                fat: 18,
                ingredients: [
                  "Greek yogurt: 150 grams",
                  "Mixed berries: 50 grams",
                  "Sliced fruits (kiwi, mango, etc.): 50 grams",
                  "Granola or nuts: 20 grams",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          {
            id: 17,
            name: "Chia Seed Breakfast Pudding",
            description:
              "A nutritious chia seed pudding made with almond or coconut milk, topped with fresh mixed berries and a dollop of Greek yogurt. A superfood breakfast that's both satisfying and energizing.",
            calories: 580,
            protein: 22,
            carbs: 45,
            fat: 25,
            imageUrl: "/chia-breakfast-pudding.png",
            tags: ["chia", "superfood", "pudding"],
            mealType: "breakfast",
            dietaryInfo: ["vegan-option", "gluten-free"],
            planVariations: {
              muscleGain: {
                calories: 1050,
                protein: 35,
                carbs: 70,
                fat: 35,
                ingredients: [
                  "Chia seeds: 40 grams",
                  "Milk (almond, coconut, etc.): 200 grams",
                  "Mixed berries: 75 grams",
                  "Greek yogurt: 50 grams",
                  "Meal = 1050-1100 kcal",
                ],
              },
              weightLoss: {
                calories: 500,
                protein: 18,
                carbs: 35,
                fat: 20,
                ingredients: [
                  "Chia seeds: 20 grams",
                  "Milk (almond, coconut, etc.): 150 grams",
                  "Mixed berries: 40 grams",
                  "Greek yogurt: 20 grams",
                  "Meal = 500 kcal",
                ],
              },
              stayFit: {
                calories: 700,
                protein: 25,
                carbs: 50,
                fat: 25,
                ingredients: [
                  "Chia seeds: 30 grams",
                  "Milk (almond, coconut, etc.): 150 grams",
                  "Mixed berries: 50 grams",
                  "Greek yogurt: 30 grams",
                  "Meal = 700 kcal",
                ],
              },
            },
          },
          // Adding snack options from the spreadsheet
          {
            id: 18,
            name: "Carrot Sticks with Hummus",
            description:
              "Fresh, crunchy carrot sticks paired with creamy hummus. A simple, nutritious snack that's perfect for satisfying hunger between meals while providing fiber and protein.",
            calories: 150,
            protein: 5,
            carbs: 15,
            fat: 7,
            imageUrl: "/carrot-sticks-hummus.png",
            tags: ["vegetables", "dip", "plant-based"],
            mealType: "snack",
            dietaryInfo: ["vegan", "gluten-free", "dairy-free"],
            planVariations: {
              muscleGain: {
                calories: 200,
                protein: 7,
                carbs: 18,
                fat: 10,
                ingredients: ["Carrot sticks: 120g", "Hummus: 40g"],
              },
              weightLoss: {
                calories: 150,
                protein: 5,
                carbs: 15,
                fat: 7,
                ingredients: ["Carrot sticks: 100g", "Hummus: 30g"],
              },
              stayFit: {
                calories: 180,
                protein: 6,
                carbs: 17,
                fat: 8,
                ingredients: ["Carrot sticks: 110g", "Hummus: 35g"],
              },
            },
          },
          {
            id: 19,
            name: "Cucumber Slices with Tzatziki",
            description:
              "Cool cucumber slices served with tangy Greek tzatziki sauce. A refreshing, low-calorie snack that's hydrating and satisfying with a delightful Mediterranean flavor.",
            calories: 120,
            protein: 4,
            carbs: 10,
            fat: 6,
            imageUrl: "/cucumber-tzatziki.png",
            tags: ["refreshing", "mediterranean", "cool"],
            mealType: "snack",
            dietaryInfo: ["vegetarian", "gluten-free", "low-calorie"],
            planVariations: {
              muscleGain: {
                calories: 160,
                protein: 6,
                carbs: 12,
                fat: 8,
                ingredients: ["Cucumber slices: 120g", "Tzatziki: 40g (2 tablespoons)"],
              },
              weightLoss: {
                calories: 120,
                protein: 4,
                carbs: 10,
                fat: 6,
                ingredients: ["Cucumber slices: 100g", "Tzatziki: 30g (2 tablespoons)"],
              },
              stayFit: {
                calories: 140,
                protein: 5,
                carbs: 11,
                fat: 7,
                ingredients: ["Cucumber slices: 110g", "Tzatziki: 35g (2 tablespoons)"],
              },
            },
          },
          {
            id: 20,
            name: "Carrots and Cucumber with Whipped Cream Cheese",
            description:
              "Crisp carrot and cucumber sticks paired with light, whipped cream cheese. A balanced snack combining fresh vegetables with creamy protein for sustained energy.",
            calories: 160,
            protein: 5,
            carbs: 12,
            fat: 9,
            imageUrl: "/veggie-cream-cheese.png",
            tags: ["vegetables", "creamy", "balanced"],
            mealType: "snack",
            dietaryInfo: ["vegetarian", "gluten-free", "keto-friendly"],
            planVariations: {
              muscleGain: {
                calories: 200,
                protein: 7,
                carbs: 14,
                fat: 12,
                ingredients: ["Carrot and cucumber sticks: 120g", "Whipped cream cheese: 40g"],
              },
              weightLoss: {
                calories: 160,
                protein: 5,
                carbs: 12,
                fat: 9,
                ingredients: ["Carrot and cucumber sticks: 100g", "Whipped cream cheese: 30g"],
              },
              stayFit: {
                calories: 180,
                protein: 6,
                carbs: 13,
                fat: 10,
                ingredients: ["Carrot and cucumber sticks: 110g", "Whipped cream cheese: 35g"],
              },
            },
          },
          {
            id: 21,
            name: "Greek Yogurt with Granola",
            description:
              "Creamy Greek yogurt topped with crunchy granola, served in a convenient bowl. A protein-rich snack with the perfect balance of creamy and crunchy textures.",
            calories: 280,
            protein: 15,
            carbs: 30,
            fat: 10,
            imageUrl: "/greek-yogurt-granola-snack.png",
            tags: ["protein", "crunchy", "quick"],
            mealType: "snack",
            dietaryInfo: ["vegetarian", "gluten-free-option"],
            planVariations: {
              muscleGain: {
                calories: 350,
                protein: 20,
                carbs: 35,
                fat: 12,
                ingredients: ["Greek yogurt: 180g", "Granola: 40g"],
              },
              weightLoss: {
                calories: 280,
                protein: 15,
                carbs: 30,
                fat: 10,
                ingredients: ["Greek yogurt: 150g", "Granola: 30g"],
              },
              stayFit: {
                calories: 280,
                protein: 15,
                carbs: 30,
                fat: 10,
                ingredients: ["Greek yogurt: 150g", "Granola: 30g"],
              },
            },
          },
          {
            id: 22,
            name: "Mixed Nuts",
            description:
              "A premium blend of almonds, walnuts, and cashews. This nutrient-dense snack provides healthy fats, protein, and essential minerals in a convenient portable package.",
            calories: 200,
            protein: 6,
            carbs: 8,
            fat: 18,
            imageUrl: "/mixed-nuts.png",
            tags: ["nuts", "protein", "healthy-fats"],
            mealType: "snack",
            dietaryInfo: ["vegetarian", "gluten-free", "vegan"],
            planVariations: {
              muscleGain: {
                calories: 300,
                protein: 9,
                carbs: 12,
                fat: 27,
                ingredients: ["Mixed nuts (almonds, walnuts, cashews): 50g (200g package)"],
              },
              weightLoss: {
                calories: 200,
                protein: 6,
                carbs: 8,
                fat: 18,
                ingredients: ["Mixed nuts (almonds, walnuts, cashews): 30g (100g package)"],
              },
              stayFit: {
                calories: 200,
                protein: 6,
                carbs: 8,
                fat: 18,
                ingredients: ["Mixed nuts (almonds, walnuts, cashews): 30g (100g package)"],
              },
            },
          },
          {
            id: 23,
            name: "Roasted Pumpkin or Sunflower Seeds",
            description:
              "Crunchy roasted seeds packed with nutrients and flavor. These seeds provide a satisfying crunch along with protein, fiber, and essential minerals in a convenient snack.",
            calories: 180,
            protein: 7,
            carbs: 6,
            fat: 14,
            imageUrl: "/roasted-seeds.png",
            tags: ["seeds", "crunchy", "nutrient-dense"],
            mealType: "snack",
            dietaryInfo: ["vegan", "gluten-free", "dairy-free"],
            planVariations: {
              muscleGain: {
                calories: 270,
                protein: 10,
                carbs: 9,
                fat: 21,
                ingredients: ["Roasted pumpkin or sunflower seeds: 50g (200g package)"],
              },
              weightLoss: {
                calories: 180,
                protein: 7,
                carbs: 6,
                fat: 14,
                ingredients: ["Roasted pumpkin or sunflower seeds: 30g (100g package)"],
              },
              stayFit: {
                calories: 180,
                protein: 7,
                carbs: 6,
                fat: 14,
                ingredients: ["Roasted pumpkin or sunflower seeds: 30g (100g package)"],
              },
            },
          },
          {
            id: 24,
            name: "Trail Mix with Dried Fruits and Nuts",
            description:
              "A balanced blend of nuts, raisins, dates, and figs. This energy-boosting snack combines protein, healthy fats, and natural sugars for sustained energy throughout the day.",
            calories: 220,
            protein: 6,
            carbs: 20,
            fat: 14,
            imageUrl: "/trail-mix.png",
            tags: ["mixed", "energy", "portable"],
            mealType: "snack",
            dietaryInfo: ["vegetarian", "gluten-free"],
            planVariations: {
              muscleGain: {
                calories: 330,
                protein: 9,
                carbs: 30,
                fat: 21,
                ingredients: ["Trail mix (nuts, raisins, dates, figs): 50g (200g package)"],
              },
              weightLoss: {
                calories: 220,
                protein: 6,
                carbs: 20,
                fat: 14,
                ingredients: ["Trail mix (nuts, raisins, dates, figs): 30g (100g package)"],
              },
              stayFit: {
                calories: 220,
                protein: 6,
                carbs: 20,
                fat: 14,
                ingredients: ["Trail mix (nuts, raisins, dates, figs): 30g (100g package)"],
              },
            },
          },
          {
            id: 25,
            name: "Protein Smoothie",
            description:
              "A nutrient-packed smoothie with fresh spinach, ripe banana, protein powder, and almond milk. Perfect for post-workout recovery or a quick breakfast on the go.",
            calories: 320,
            protein: 25,
            carbs: 35,
            fat: 10,
            imageUrl: "/protein-smoothie.png",
            tags: ["smoothie", "high-protein", "quick"],
            mealType: "snack",
            dietaryInfo: ["vegetarian", "dairy-free"],
            planVariations: {
              muscleGain: {
                calories: 420,
                protein: 35,
                carbs: 45,
                fat: 12,
                ingredients: [
                  "Spinach (fresh): 45g",
                  "Banana (ripe): 90g (1 medium)",
                  "Protein powder: 35g (1.5 scoops)",
                  "Unsweetened almond milk: 250ml",
                  "Served in a bottle (400ml)",
                ],
              },
              weightLoss: {
                calories: 320,
                protein: 25,
                carbs: 35,
                fat: 10,
                ingredients: [
                  "Spinach (fresh): 30g",
                  "Banana (ripe): 60g (½ medium)",
                  "Protein powder: 25g (1 scoop)",
                  "Unsweetened almond milk: 185ml",
                  "Served in a bottle (300ml)",
                ],
              },
              stayFit: {
                calories: 320,
                protein: 25,
                carbs: 35,
                fat: 10,
                ingredients: [
                  "Spinach (fresh): 30g",
                  "Banana (ripe): 60g (½ medium)",
                  "Protein powder: 25g (1 scoop)",
                  "Unsweetened almond milk: 185ml",
                  "Served in a bottle (300ml)",
                ],
              },
            },
          },
          {
            id: 26,
            name: "Berry Smoothie",
            description:
              "A refreshing blend of mixed berries, Greek yogurt, and a splash of orange juice. This antioxidant-rich smoothie provides a perfect balance of sweet and tangy flavors.",
            calories: 280,
            protein: 15,
            carbs: 40,
            fat: 5,
            imageUrl: "/berry-smoothie.png",
            tags: ["smoothie", "berries", "refreshing"],
            mealType: "snack",
            dietaryInfo: ["vegetarian", "gluten-free"],
            planVariations: {
              muscleGain: {
                calories: 380,
                protein: 20,
                carbs: 55,
                fat: 7,
                ingredients: [
                  "Mixed berries (frozen/fresh): 150g",
                  "Greek yogurt (2% fat): 150g",
                  "Orange juice (no sugar added): 45ml",
                  "Water (or ice): 100ml",
                  "Served in a bottle (400ml)",
                ],
              },
              weightLoss: {
                calories: 280,
                protein: 15,
                carbs: 40,
                fat: 5,
                ingredients: [
                  "Mixed berries (frozen/fresh): 100g",
                  "Greek yogurt (2% fat): 100g",
                  "Orange juice (no sugar added): 30ml",
                  "Water (or ice): 70ml",
                  "Served in a bottle (300ml)",
                ],
              },
              stayFit: {
                calories: 280,
                protein: 15,
                carbs: 40,
                fat: 5,
                ingredients: [
                  "Mixed berries (frozen/fresh): 100g",
                  "Greek yogurt (2% fat): 100g",
                  "Orange juice (no sugar added): 30ml",
                  "Water (or ice): 70ml",
                  "Served in a bottle (300ml)",
                ],
              },
            },
          },
          {
            id: 27,
            name: "Green Smoothie",
            description:
              "A tropical green smoothie with spinach, pineapple, mango, and coconut milk. This nutrient-dense blend offers a perfect combination of leafy greens and sweet tropical fruits.",
            calories: 290,
            protein: 5,
            carbs: 45,
            fat: 10,
            imageUrl: "/green-smoothie.png",
            tags: ["smoothie", "tropical", "green"],
            mealType: "snack",
            dietaryInfo: ["vegan", "gluten-free", "dairy-free"],
            planVariations: {
              muscleGain: {
                calories: 390,
                protein: 7,
                carbs: 60,
                fat: 14,
                ingredients: [
                  "Spinach (fresh): 45g",
                  "Pineapple (fresh or frozen): 90g",
                  "Mango (fresh or frozen): 90g",
                  "Light coconut milk: 225ml",
                  "Served in a bottle (400ml)",
                ],
              },
              weightLoss: {
                calories: 290,
                protein: 5,
                carbs: 45,
                fat: 10,
                ingredients: [
                  "Spinach (fresh): 30g",
                  "Pineapple (fresh or frozen): 60g",
                  "Mango (fresh or frozen): 60g",
                  "Light coconut milk: 150ml",
                  "Served in a bottle (300ml)",
                ],
              },
              stayFit: {
                calories: 290,
                protein: 5,
                carbs: 45,
                fat: 10,
                ingredients: [
                  "Spinach (fresh): 30g",
                  "Pineapple (fresh or frozen): 60g",
                  "Mango (fresh or frozen): 60g",
                  "Light coconut milk: 150ml",
                  "Served in a bottle (300ml)",
                ],
              },
            },
          },
        ]

        // Update meals with IDs 1-7 to use "main" instead of "lunch" or "dinner"
        const mainMealIds = [1, 2, 3, 4, 5, 6, 7]
        mainMealIds.forEach((id) => {
          const mealIndex = mockMeals.findIndex((meal) => meal.id === id)
          if (mealIndex !== -1) {
            mockMeals[mealIndex].mealType = "main"
          }
        })

        setMeals(mockMeals)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching meals:", error)
        setLoading(false)
      }
    }

    fetchMeals()
  }, [])

  // Filter and sort meals based on current filters
  const filteredMeals = useMemo(() => {
    if (meals.length === 0) return []

    let result = [...meals]

    // Filter by tab (meal type)
    if (activeTab !== "all") {
      result = result.filter((meal) => meal.mealType === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (meal) =>
          meal.name.toLowerCase().includes(query) ||
          meal.description.toLowerCase().includes(query) ||
          meal.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Filter by selected meal types
    if (selectedMealTypes.length > 0) {
      result = result.filter((meal) => selectedMealTypes.includes(meal.mealType))
    }

    // Filter by selected diets
    if (selectedDiets.length > 0) {
      result = result.filter((meal) => selectedDiets.some((diet) => meal.dietaryInfo.includes(diet)))
    }

    // Filter by calorie range
    result = result.filter((meal) => meal.calories >= calorieRange[0] && meal.calories <= calorieRange[1])

    // Sort results
    if (sortOption === "calories-low") {
      result.sort((a, b) => a.calories - b.calories)
    } else if (sortOption === "calories-high") {
      result.sort((a, b) => b.calories - a.calories)
    } else if (sortOption === "protein-high") {
      result.sort((a, b) => b.protein - a.protein)
    } else if (sortOption === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [meals, searchQuery, selectedMealTypes, selectedDiets, calorieRange, sortOption, activeTab])

  // Handle tab change
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value)
      router.push(`/meals${value !== "all" ? `?type=${value}` : ""}`, { scroll: false })
    },
    [router],
  )

  // Toggle meal type filter
  const toggleMealType = useCallback((type: string) => {
    setSelectedMealTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }, [])

  // Toggle diet filter
  const toggleDiet = useCallback((diet: string) => {
    setSelectedDiets((prev) => (prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]))
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery("")
    setSelectedMealTypes([])
    setSelectedDiets([])
    setCalorieRange([0, 1200])
    setSortOption("popular")
  }, [])

  // Open meal detail
  const openMealDetail = useCallback((meal: Meal) => {
    setSelectedMeal(meal)
  }, [])

  // Close meal detail
  const closeMealDetail = useCallback(() => {
    setSelectedMeal(null)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Our Meals</h1>
        <p className="text-gray-600 max-w-3xl">
          Browse our selection of nutritious, chef-prepared meals designed to support your health and fitness goals.
        </p>
      </div>

      {/* Tabs for meal types */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Meals</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="main">Main Meals</TabsTrigger>
            <TabsTrigger value="snack">Snacks</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  Sort by
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSortOption("popular")}>
                    Most Popular
                    {sortOption === "popular" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("calories-low")}>
                    Calories: Low to High
                    {sortOption === "calories-low" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("calories-high")}>
                    Calories: High to Low
                    {sortOption === "calories-high" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("protein-high")}>
                    Highest Protein
                    {sortOption === "protein-high" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("alphabetical")}>
                    Alphabetical
                    {sortOption === "alphabetical" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Meals</SheetTitle>
                  <SheetDescription>Customize your meal search with these filters.</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  {/* Meal Type Filter */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Meal Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["breakfast", "main", "snack"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedMealTypes.includes(type)}
                            onCheckedChange={() => toggleMealType(type)}
                          />
                          <Label htmlFor={`type-${type}`} className="capitalize">
                            {type === "main" ? "Main Meals" : type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Dietary Preferences */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Dietary Preferences</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["vegetarian", "vegan", "gluten-free", "dairy-free"].map((diet) => (
                        <div key={diet} className="flex items-center space-x-2">
                          <Checkbox
                            id={`diet-${diet}`}
                            checked={selectedDiets.includes(diet)}
                            onCheckedChange={() => toggleDiet(diet)}
                          />
                          <Label htmlFor={`diet-${diet}`} className="capitalize">
                            {diet.replace("-", " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Calorie Range */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Calorie Range</h3>
                      <span className="text-sm text-gray-500">
                        {calorieRange[0]} - {calorieRange[1]} cal
                      </span>
                    </div>
                    <div className="px-2">
                      <div className="relative pt-1">
                        <input
                          type="range"
                          min="0"
                          max="1200"
                          step="50"
                          value={calorieRange[1]}
                          onChange={(e) => setCalorieRange([calorieRange[0], Number.parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <SheetFooter className="flex-row justify-between sm:justify-between">
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <SheetClose asChild>
                    <Button>Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search meals by name, ingredients, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Active filters display */}
        {(selectedMealTypes.length > 0 ||
          selectedDiets.length > 0 ||
          calorieRange[0] > 0 ||
          calorieRange[1] < 1200) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedMealTypes.map((type) => (
              <Badge key={type} variant="secondary" className="capitalize">
                {type}
                <button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => toggleMealType(type)}>
                  ×
                </button>
              </Badge>
            ))}
            {selectedDiets.map((diet) => (
              <Badge key={diet} variant="secondary" className="capitalize">
                {diet.replace("-", " ")}
                <button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => toggleDiet(diet)}>
                  ×
                </button>
              </Badge>
            ))}
            {(calorieRange[0] > 0 || calorieRange[1] < 1200) && (
              <Badge variant="secondary">
                {calorieRange[0]}-{calorieRange[1]} calories
                <button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setCalorieRange([0, 1200])}>
                  ×
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6">
              Clear all
            </Button>
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-500 mb-6">
          {filteredMeals.length} {filteredMeals.length === 1 ? "meal" : "meals"} found
        </div>

        {/* Meal grid */}
        <TabsContent value="all" className="mt-0">
          {renderMealGrid()}
        </TabsContent>
        <TabsContent value="breakfast" className="mt-0">
          {renderMealGrid()}
        </TabsContent>
        <TabsContent value="main" className="mt-0">
          {renderMealGrid()}
        </TabsContent>
        <TabsContent value="snack" className="mt-0">
          {renderMealGrid()}
        </TabsContent>
      </Tabs>

      {/* Meal detail component */}
      <MealDetail
        meal={selectedMeal}
        open={!!selectedMeal}
        onOpenChange={closeMealDetail}
        onAddToMeals={() => {
          // Handle adding to meals
          closeMealDetail()
        }}
      />
    </div>
  )

  // Helper function to render meal grid
  function renderMealGrid() {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (filteredMeals.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No meals found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search query.</p>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} onViewDetails={openMealDetail} />
        ))}
      </div>
    )
  }
}
