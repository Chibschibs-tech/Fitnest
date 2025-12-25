"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, ChevronDown, Check, X, AlertCircle, RefreshCw, Sparkles, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { MealCard } from "./components/meal-card"
import { MealDetail } from "./components/meal-detail"


export interface Meal {
  id: string
  name: string
  description: string
  image: string
  sku: string
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  status: "active" | "inactive"
  updated_at: string
  created_at: string
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("popular")
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch meals data
  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
      
      const response = await fetch(`${API_BASE}/meals?status=active`, {
        cache: 'no-store',
      })
      
      if (!response.ok) {
        throw new Error(`Failed to load meals. Please try again.`)
      }
      
      const apiData = await response.json()
      
      // Handle different API response structures
      const fetchedMeals: Meal[] = Array.isArray(apiData.data) ? apiData.data : apiData
      
      setMeals(fetchedMeals)
    } catch (error) {
      console.error("Error fetching meals:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      setMeals([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  // Filter and sort meals based on search and sort
  const filteredMeals = useMemo(() => {
    if (meals.length === 0) return []

    let result = [...meals]

    // Filter by debounced search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase().trim()
      result = result.filter(
        (meal) =>
          meal.name.toLowerCase().includes(query) ||
          meal.description.toLowerCase().includes(query),
      )
    }

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
  }, [meals, debouncedSearchQuery, sortOption])

  // Get sort option label
  const getSortLabel = useCallback((option: string) => {
    const labels: Record<string, string> = {
      popular: "Les Plus Populaires",
      "calories-low": "Calories : Faible à Élevé",
      "calories-high": "Calories : Élevé à Faible",
      "protein-high": "Protéines Élevées",
      alphabetical: "Alphabétique",
    }
    return labels[option] || "Sort by"
  }, [])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setDebouncedSearchQuery("")
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 md:px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-fitnest-orange/10 rounded-full px-4 py-2 mb-4">
            <UtensilsCrossed className="h-4 w-4 text-fitnest-orange" />
            <span className="text-sm font-semibold text-fitnest-orange">Notre Menu</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
            Explorez Nos{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Recettes
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            Découvrez notre sélection de repas nutritifs, préparés par nos chefs pour accompagner vos objectifs santé et fitness.
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search 
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" 
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Chercher les recettes par nom ou description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    clearSearch()
                  }
                }}
                className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-fitnest-green rounded-xl font-medium text-base shadow-sm"
                aria-label="Search meals"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-fitnest-orange transition-colors bg-gray-100 hover:bg-gray-200 rounded-lg p-1.5"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-12 w-full sm:w-auto justify-between sm:justify-start border-2 border-gray-200 hover:border-fitnest-green rounded-xl font-semibold shadow-sm"
                  aria-label="Sort meals"
                >
                  <span className="hidden sm:inline">{getSortLabel(sortOption)}</span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-2 shadow-lg">
                <DropdownMenuLabel className="font-bold text-gray-900">Options de Tri</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("popular")}
                    className="font-medium cursor-pointer"
                  >
                    Les Plus Populaires
                    {sortOption === "popular" && <Check className="ml-auto h-4 w-4 text-fitnest-green" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("calories-low")}
                    className="font-medium cursor-pointer"
                  >
                    Calories : Faible à Élevé
                    {sortOption === "calories-low" && <Check className="ml-auto h-4 w-4 text-fitnest-green" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("calories-high")}
                    className="font-medium cursor-pointer"
                  >
                    Calories : Élevé à Faible
                    {sortOption === "calories-high" && <Check className="ml-auto h-4 w-4 text-fitnest-green" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("protein-high")}
                    className="font-medium cursor-pointer"
                  >
                    Protéines Élevées
                    {sortOption === "protein-high" && <Check className="ml-auto h-4 w-4 text-fitnest-green" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("alphabetical")}
                    className="font-medium cursor-pointer"
                  >
                    Alphabétique
                    {sortOption === "alphabetical" && <Check className="ml-auto h-4 w-4 text-fitnest-green" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Results count and search indicator */}
          {!loading && (
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="text-sm font-semibold">
                {debouncedSearchQuery ? (
                  <>
                    Found <span className="text-fitnest-green">{filteredMeals.length}</span>{" "}
                    {filteredMeals.length === 1 ? "meal" : "meals"} for{" "}
                    <span className="text-fitnest-orange">&quot;{debouncedSearchQuery}&quot;</span>
                  </>
                ) : (
                  <span className="text-gray-900 font-semibold">
                    {filteredMeals.length} {filteredMeals.length === 1 ? "Recette" : "Recettes"}
                  </span>
                )}
              </div>
              {searchQuery !== debouncedSearchQuery && (
                <div className="flex items-center gap-2 text-xs text-fitnest-orange font-semibold">
                  <div className="animate-spin">
                    <RefreshCw className="h-3 w-3" />
                  </div>
                  Searching...
                </div>
              )}
            </div>
          )}

          {/* Meal grid */}
          {renderMealGrid()}
        </div>

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
    </div>
  )

  // Helper function to render meal grid
  function renderMealGrid() {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-3xl border-0 shadow-md">
              <Skeleton className="h-56 w-full" />
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-4 pt-3">
                  <Skeleton className="h-10 w-20 rounded-lg" />
                  <Skeleton className="h-10 w-20 rounded-lg" />
                  <Skeleton className="h-10 w-20 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-16 md:py-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">Unable to load meals</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-base md:text-lg leading-relaxed font-medium">{error}</p>
          <Button 
            onClick={fetchMeals} 
            className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </Button>
        </div>
      )
    }

    if (filteredMeals.length === 0) {
      return (
        <div className="text-center py-16 md:py-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-fitnest-green/10 to-fitnest-orange/10 mb-6">
            {debouncedSearchQuery ? (
              <Search className="h-10 w-10 text-fitnest-orange" />
            ) : (
              <UtensilsCrossed className="h-10 w-10 text-fitnest-green" />
            )}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
            {debouncedSearchQuery ? "No meals found" : "No meals available"}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-base md:text-lg leading-relaxed font-medium">
            {debouncedSearchQuery
              ? `We couldn't find any meals matching "${debouncedSearchQuery}". Try a different search term.`
              : "There are no meals available at the moment. Please check back later."}
          </p>
          {debouncedSearchQuery && (
            <Button 
              onClick={clearSearch} 
              variant="outline"
              className="border-2 border-gray-200 hover:border-fitnest-orange hover:text-fitnest-orange font-bold px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <X className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
              <span>Clear Search</span>
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} onViewDetails={openMealDetail} />
        ))}
      </div>
    )
  }
}
