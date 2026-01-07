"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, ChevronDown, Check, X, AlertCircle, RefreshCw, UtensilsCrossed } from "lucide-react"
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
import { MealCard } from "./meal-card"
import { MealDetail } from "./meal-detail"
import type { Meal } from "@/lib/api/home"

interface MealsClientProps {
  initialMeals: Meal[]
  searchQuery?: string
}

export function MealsClient({ initialMeals, searchQuery = "" }: MealsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchQuery)
  const [sortOption, setSortOption] = useState("popular")
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchValue("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    params.delete("page")
    router.push(`/meals?${params.toString()}`)
  }, [router, searchParams])

  // Handle search
  const handleSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Reset pagination when search changes
    params.delete("page")
    
    if (value.trim()) {
      params.set("search", value.trim())
    } else {
      params.delete("search")
    }
    
    router.push(`/meals?${params.toString()}`)
  }, [router, searchParams])

  // Sort meals based on sort option (search is handled server-side)
  const sortedMeals = useMemo(() => {
    if (initialMeals.length === 0) return []

    let result = [...initialMeals]

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
  }, [initialMeals, sortOption])

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


  // Open meal detail
  const openMealDetail = useCallback((meal: Meal) => {
    setSelectedMeal(meal)
  }, [])

  // Close meal detail
  const closeMealDetail = useCallback(() => {
    setSelectedMeal(null)
  }, [])

  return (
    <>
      {/* Search and Sort Controls */}
      <div className="mb-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Sort dropdown */}
            <div className="w-full md:w-auto">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-1">
                Trier par
              </label>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-11 w-[280px] justify-between bg-gray-50 border-0 rounded-lg hover:bg-gray-100 transition-colors text-sm font-normal"
                aria-label="Sort meals"
              >
                <span className="flex items-center gap-2 w-full">
                  <span className="text-left flex-1">{getSortLabel(sortOption)}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </span>
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

            {/* Search Bar */}
            <div className="w-full md:flex-1 md:max-w-md">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-1">
                Rechercher une recette
              </label>
              <div className="relative">
                <Search 
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" 
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  placeholder="Rechercher une recette..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(searchValue)
                    } else if (e.key === "Escape") {
                      clearSearch()
                    }
                  }}
                  className="h-11 w-full pl-10 pr-10 rounded-lg bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-fitnest-green/20 hover:bg-gray-100 transition-all duration-200 text-sm font-normal placeholder:text-gray-400"
                  aria-label="Search meals"
                />
                {searchValue && (
                  <Button
                    onClick={clearSearch}
                    variant="ghost"
                    size="sm"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-200 rounded-md transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5 text-gray-500" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      {sortedMeals.length > 0 && (
        <div className="mb-8 max-w-6xl mx-auto px-1">
          <p className="text-sm font-semibold text-gray-900">
            {sortedMeals.length}{" "}
            {sortedMeals.length === 1 ? "Recette" : "Recettes"}
            {searchQuery && (
              <span className="text-fitnest-orange"> pour &quot;{searchQuery}&quot;</span>
            )}
          </p>
        </div>
      )}

      {/* Meal grid */}
      <div className="max-w-6xl mx-auto">
        {sortedMeals.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-fitnest-green/10 to-fitnest-orange/10 mb-6">
              {searchQuery ? (
                <Search className="h-10 w-10 text-fitnest-orange" />
              ) : (
                <UtensilsCrossed className="h-10 w-10 text-fitnest-green" />
              )}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
              {searchQuery ? "Aucune recette trouvée" : "Aucune recette disponible"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-base md:text-lg leading-relaxed font-medium">
              {searchQuery
                ? `Aucune recette ne correspond à "${searchQuery}". Essayez une autre recherche.`
                : "Aucune recette disponible pour le moment. Revenez plus tard."}
            </p>
            {searchQuery && (
              <Button 
                onClick={clearSearch} 
                variant="outline"
                className="border-2 border-gray-200 hover:border-fitnest-orange hover:text-fitnest-orange font-bold px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <X className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                <span>Effacer la recherche</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sortedMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onViewDetails={openMealDetail} />
            ))}
          </div>
        )}
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
    </>
  )
}

