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
}

export default function MealsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([])
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [calorieRange, setCalorieRange] = useState<[number, number]>([0, 1000])
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
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockMeals: Meal[] = [
          {
            id: 1,
            name: "Grilled Chicken & Vegetable Medley",
            description: "Tender grilled chicken breast with a colorful mix of roasted vegetables and quinoa.",
            calories: 420,
            protein: 35,
            carbs: 30,
            fat: 15,
            imageUrl: "/grilled-chicken-vegetable-medley.png",
            tags: ["high-protein", "low-carb"],
            mealType: "lunch",
            dietaryInfo: ["gluten-free"],
          },
          {
            id: 2,
            name: "Rainbow Grain Bowl",
            description: "A vibrant bowl with mixed grains, roasted vegetables, avocado, and tahini dressing.",
            calories: 380,
            protein: 12,
            carbs: 45,
            fat: 18,
            imageUrl: "/rainbow-grain-bowl.png",
            tags: ["vegetarian", "fiber-rich"],
            mealType: "lunch",
            dietaryInfo: ["vegetarian"],
          },
          {
            id: 3,
            name: "Chicken Quinoa Power Bowl",
            description: "Grilled chicken with quinoa, roasted vegetables, and tahini dressing.",
            calories: 420,
            protein: 35,
            carbs: 45,
            fat: 12,
            imageUrl: "/chicken-quinoa-power-bowl.png",
            tags: ["high-protein", "balanced"],
            mealType: "dinner",
            dietaryInfo: ["gluten-free"],
          },
          {
            id: 4,
            name: "Greek Yogurt Parfait",
            description: "Greek yogurt with mixed berries, honey, and granola.",
            calories: 280,
            protein: 15,
            carbs: 40,
            fat: 8,
            imageUrl: "/layered-berry-parfait.png",
            tags: ["quick", "breakfast"],
            mealType: "breakfast",
            dietaryInfo: ["vegetarian"],
          },
          {
            id: 5,
            name: "Salmon with Quinoa",
            description: "Baked salmon fillet with lemon herb quinoa and steamed broccoli.",
            calories: 420,
            protein: 32,
            carbs: 30,
            fat: 20,
            imageUrl: "/pan-seared-salmon-quinoa.png",
            tags: ["omega-3", "high-protein"],
            mealType: "dinner",
            dietaryInfo: ["gluten-free", "dairy-free"],
          },
          {
            id: 6,
            name: "Protein Pancakes",
            description: "Fluffy protein-packed pancakes with fresh berries and sugar-free syrup.",
            calories: 340,
            protein: 25,
            carbs: 30,
            fat: 12,
            imageUrl: "/fluffy-protein-stack.png",
            tags: ["breakfast", "high-protein"],
            mealType: "breakfast",
            dietaryInfo: ["vegetarian"],
          },
          {
            id: 7,
            name: "Turkey Meatballs",
            description: "Lean turkey meatballs with zucchini noodles and homemade marinara sauce.",
            calories: 380,
            protein: 28,
            carbs: 22,
            fat: 19,
            imageUrl: "/savory-turkey-meatballs.png",
            tags: ["high-protein", "low-carb"],
            mealType: "dinner",
            dietaryInfo: ["dairy-free"],
          },
          {
            id: 8,
            name: "Vegetable Stir Fry",
            description: "Mixed vegetables stir-fried with tofu in a light ginger sauce.",
            calories: 320,
            protein: 18,
            carbs: 35,
            fat: 14,
            imageUrl: "/vibrant-vegetable-stir-fry.png",
            tags: ["vegetarian", "quick"],
            mealType: "dinner",
            dietaryInfo: ["vegetarian", "vegan", "gluten-free"],
          },
          {
            id: 9,
            name: "Egg White Omelette",
            description: "Fluffy egg white omelette with spinach, mushrooms, and feta cheese.",
            calories: 250,
            protein: 22,
            carbs: 8,
            fat: 14,
            imageUrl: "/fluffy-egg-white-omelette.png",
            tags: ["high-protein", "low-carb"],
            mealType: "breakfast",
            dietaryInfo: ["gluten-free", "vegetarian"],
          },
          {
            id: 10,
            name: "Beef and Broccoli",
            description: "Lean beef strips with broccoli in a savory sauce with brown rice.",
            calories: 450,
            protein: 30,
            carbs: 40,
            fat: 15,
            imageUrl: "/classic-beef-broccoli.png",
            tags: ["high-protein", "balanced"],
            mealType: "dinner",
            dietaryInfo: ["dairy-free"],
          },
          {
            id: 11,
            name: "Tuna Avocado Wrap",
            description: "Tuna salad with avocado and mixed greens in a whole grain wrap.",
            calories: 380,
            protein: 28,
            carbs: 30,
            fat: 18,
            imageUrl: "/fresh-tuna-avocado-wrap.png",
            tags: ["high-protein", "omega-3"],
            mealType: "lunch",
            dietaryInfo: ["dairy-free"],
          },
          {
            id: 12,
            name: "Overnight Oats",
            description: "Rolled oats soaked overnight with almond milk, chia seeds, and mixed berries.",
            calories: 310,
            protein: 12,
            carbs: 45,
            fat: 10,
            imageUrl: "/colorful-overnight-oats.png",
            tags: ["breakfast", "fiber-rich"],
            mealType: "breakfast",
            dietaryInfo: ["vegetarian", "vegan", "dairy-free"],
          },
        ]

        setMeals(mockMeals)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching meals:", error)
        setLoading(false)
      }
    }

    fetchMeals()
  }, []) // Only run once on component mount

  // Filter and sort meals based on current filters
  const filteredMeals = useMemo(() => {
    if (meals.length === 0) return [] // Skip if meals aren't loaded yet

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
    // Default is "popular" which is the original order

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
    setCalorieRange([0, 1000])
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
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
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
                      {["breakfast", "lunch", "dinner", "snack"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedMealTypes.includes(type)}
                            onCheckedChange={() => toggleMealType(type)}
                          />
                          <Label htmlFor={`type-${type}`} className="capitalize">
                            {type}
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
                          max="1000"
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
          calorieRange[1] < 1000) && (
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
            {(calorieRange[0] > 0 || calorieRange[1] < 1000) && (
              <Badge variant="secondary">
                {calorieRange[0]}-{calorieRange[1]} calories
                <button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => setCalorieRange([0, 1000])}>
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
        <TabsContent value="lunch" className="mt-0">
          {renderMealGrid()}
        </TabsContent>
        <TabsContent value="dinner" className="mt-0">
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
