import { UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { MealsClient } from "./components/meals-client"
import type { Meal } from "@/lib/api/home"

interface PaginatedResponse {
  meals: Meal[]
  total: number
  currentPage: number
  totalPages: number
}

async function getMeals(page: number = 1, search?: string): Promise<PaginatedResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
  const ITEMS_PER_PAGE = 9 // Must match backend limit
  
  try {
    // Calculate offset from page number (offset = (page - 1) * limit)
    const offset = (page - 1) * ITEMS_PER_PAGE
    
    // Build URL with search and pagination parameters
    const url = new URL(`${API_BASE}/meals/recipes`)
    url.searchParams.set('offset', offset.toString())
    
    if (search && search.trim()) {
      url.searchParams.set('search', search.trim())
    }
        
    const response = await fetch(url.toString(), {
      cache: 'no-store' // Fresh data on each request
    })
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - URL: ${url.toString()}`)
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()

    // Handle API response structure
    const meals = Array.isArray(data.data) ? data.data : []
    const pagination = data.pagination || {}
    
    return {
      meals,
      total: pagination.total || meals.length,
      currentPage: pagination.current_page || page,
      totalPages: pagination.total_pages || 1
    }
  } catch (error) {
    console.error('Failed to fetch meals:', error)
    // Return fallback data in case of error
    return {
      meals: [],
      total: 0,
      currentPage: 1,
      totalPages: 1
    }
  }
}

interface MealsPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

export default async function MealsPage({ searchParams }: MealsPageProps) {
  // Await searchParams (Next.js 15+)
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const searchQuery = params.search || ""
  
  // Fetch meals data server-side
  const { meals, total, totalPages } = await getMeals(currentPage, searchQuery)

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

        {/* Client-side interactive component */}
        <MealsClient initialMeals={meals} searchQuery={searchQuery} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <Link
              href={`/meals?${new URLSearchParams({
                ...(searchQuery && { search: searchQuery }),
                page: Math.max(1, currentPage - 1).toString()
              }).toString()}`}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                currentPage <= 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              aria-disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)

              if (!showPage) {
                // Show ellipsis
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span
                      key={pageNum}
                      className="inline-flex items-center justify-center w-10 h-10 text-gray-400"
                    >
                      ...
                    </span>
                  )
                }
                return null
              }

              return (
                <Link
                  key={pageNum}
                  href={`/meals?${new URLSearchParams({
                    ...(searchQuery && { search: searchQuery }),
                    page: pageNum.toString()
                  }).toString()}`}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors font-medium ${
                    currentPage === pageNum
                      ? "bg-fitnest-green text-white border-fitnest-green"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}

            <Link
              href={`/meals?${new URLSearchParams({
                ...(searchQuery && { search: searchQuery }),
                page: Math.min(totalPages, currentPage + 1).toString()
              }).toString()}`}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                currentPage >= totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              aria-disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
