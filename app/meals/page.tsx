"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, ChevronDown, Check, X, AlertCircle, RefreshCw } from "lucide-react"
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
      popular: "Most Popular",
      "calories-low": "Calories: Low to High",
      "calories-high": "Calories: High to Low",
      "protein-high": "Highest Protein",
      alphabetical: "Alphabetical",
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
    <div className="container mx-auto px-4 py-8 md:py-12 md:px-6">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Explore Our Meals</h1>
        <p className="text-gray-600 max-w-3xl text-base md:text-lg">
          Browse our selection of nutritious, chef-prepared meals designed to support your health and fitness goals.
        </p>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search 
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" 
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search meals by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  clearSearch()
                }
              }}
              className="pl-10 pr-10 h-11"
              aria-label="Search meals"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                className="flex items-center gap-2 h-11 w-full sm:w-auto justify-between sm:justify-start"
                aria-label="Sort meals"
              >
                <span className="hidden sm:inline">{getSortLabel(sortOption)}</span>
                <span className="sm:hidden">Sort</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
        </div>

        {/* Results count and search indicator */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              {debouncedSearchQuery ? (
                <>
                  Found <span className="font-semibold text-gray-900">{filteredMeals.length}</span>{" "}
                  {filteredMeals.length === 1 ? "meal" : "meals"} for &quot;{debouncedSearchQuery}&quot;
                </>
              ) : (
                <>
                  Showing <span className="font-semibold text-gray-900">{filteredMeals.length}</span>{" "}
                  {filteredMeals.length === 1 ? "meal" : "meals"}
                </>
              )}
            </div>
            {searchQuery !== debouncedSearchQuery && (
              <div className="text-xs text-gray-400 animate-pulse">Searching...</div>
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
  )

  // Helper function to render meal grid
  function renderMealGrid() {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-12 md:py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Unable to load meals</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
          <Button onClick={fetchMeals} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )
    }

    if (filteredMeals.length === 0) {
      return (
        <div className="text-center py-12 md:py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            {debouncedSearchQuery ? "No meals found" : "No meals available"}
          </h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            {debouncedSearchQuery
              ? `We couldn't find any meals matching "${debouncedSearchQuery}". Try a different search term.`
              : "There are no meals available at the moment. Please check back later."}
          </p>
          {debouncedSearchQuery && (
            <Button onClick={clearSearch} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Clear Search
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
