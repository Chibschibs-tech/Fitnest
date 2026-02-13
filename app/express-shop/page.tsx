import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Sparkles, ChevronRight, ShoppingBag, Zap, TrendingUp, Package, ChevronLeft } from "lucide-react"
import { CategoryFilter } from "./category-filter"
import { SearchBar } from "./search-bar"
import { ProductCard } from "./product-card"
import { Suspense } from "react"

interface Product {
  id: string
  name: string
  description: string
  images: string[]
  category: {
    name: string
  }
  price: {
    base: number
    discount: number
  }
  quantity: number
  stock_quantity: number
}

interface Category {
  id: string
  created_at: string
  deleted_at: string | null
  name: string
  updated_at: string
}

interface CategoryOption {
  id: string
  name: string
}

interface PaginatedResponse {
  products: Product[]
  total: number
  currentPage: number
  totalPages: number
}

async function getProducts(categoryName?: string, page: number = 1, search?: string): Promise<PaginatedResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
  const ITEMS_PER_PAGE = 8
  
  try {
    // Calculate offset from page number (offset = (page - 1) * limit)
    const offset = (page - 1) * ITEMS_PER_PAGE
    
    // Build URL with category, search, and pagination parameters
    const url = new URL(`${API_BASE}/products/express-shop`)
    url.searchParams.set('offset', offset.toString())
    
    if (categoryName && categoryName !== 'all') {
      url.searchParams.set('category', categoryName)
    }
    
    if (search && search.trim()) {
      url.searchParams.set('search', search.trim())
    }
        
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - URL: ${url.toString()}`)
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()

    // Handle API response structure
    const products = Array.isArray(data.data) ? data.data : []
    const pagination = data.pagination || {}
    
    return {
      products,
      total: pagination.total || products.length,
      currentPage: pagination.current_page || page,
      totalPages: pagination.total_pages || 1
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
    // Return fallback data in case of error
    return {
      products: [],
      total: 0,
      currentPage: 1,
      totalPages: 1
    }
  }
}

async function getCategories(): Promise<CategoryOption[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
  
  try {
    const response = await fetch(`${API_BASE}/categories/express-shop`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Extract category id and name from the response
    const categoryOptions: CategoryOption[] = Array.isArray(data.data) 
      ? data.data.map((cat: Category) => ({ id: cat.id, name: cat.name }))
      : []
    
    // Return "all" plus the fetched categories
    return [{ id: 'all', name: 'all' }, ...categoryOptions]
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    // Return default "all" in case of error
    return [{ id: 'all', name: 'all' }]
  }
}

interface ExpressShopProps {
  searchParams: { category?: string; page?: string; search?: string }
}

export default async function ExpressShop({ searchParams }: ExpressShopProps) {
  // Get selected category name, page, and search from search params
  const params = await searchParams
  const selectedCategoryName = params.category || "all"
  const currentPage = parseInt(params.page || "1", 10)
  const searchQuery = params.search || ""
  
  // Fetch categories first, then products with the selected category, page, and search
  const categories = await getCategories()
  const { products, total, totalPages } = await getProducts(selectedCategoryName, currentPage, searchQuery)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 md:px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-4">
            <ShoppingBag className="h-4 w-4 text-fitnest-green" />
            <span className="text-sm font-semibold text-fitnest-green">Livraison Rapide</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
            Express{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Shop
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600 text-base md:text-lg leading-relaxed font-medium mb-8">
            Explorez notre gamme de snacks sains, barres protéinées et compléments haut de gamme, livrés rapidement chez vous.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-fitnest-green/10 rounded-lg p-2">
                <Zap className="h-4 w-4 text-fitnest-green" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Livraison Rapide</span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="bg-fitnest-orange/10 rounded-lg p-2">
                <Package className="h-4 w-4 text-fitnest-orange" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Produits de Qualité</span>
            </div>
            <div className="hidden sm:block h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="bg-fitnest-green/10 rounded-lg p-2">
                <TrendingUp className="h-4 w-4 text-fitnest-green" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Meilleurs Prix</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Category Filter */}
              <div className="w-full md:w-auto">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-1">
                  Filtrer par catégorie
                </label>
                <Suspense fallback={<div className="h-11 w-[280px] rounded-lg bg-gray-100 animate-pulse" />}>
                  <CategoryFilter categories={categories} activeCategory={selectedCategoryName} />
                </Suspense>
              </div>

              {/* Search Bar */}
              <div className="w-full md:flex-1 md:max-w-md">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-1">
                  Rechercher un produit
                </label>
                <Suspense fallback={<div className="h-11 w-full rounded-lg bg-gray-100 animate-pulse" />}>
                  <SearchBar />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {products.length > 0 && (
          <div className="mb-8 max-w-6xl mx-auto px-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                {total}{" "}
                {total === 1 ? "Produit" : "Produits"}
                {searchQuery && (
                  <span className="text-fitnest-orange"> pour "{searchQuery}"</span>
                )}
                {selectedCategoryName !== "all" && !searchQuery && (
                  <span className="text-fitnest-orange"> dans {selectedCategoryName}</span>
                )}
                {selectedCategoryName !== "all" && searchQuery && (
                  <span className="text-gray-600"> dans {selectedCategoryName}</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="flex min-h-[500px] flex-col items-center justify-center space-y-6 text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-fitnest-green/10 to-fitnest-orange/10 shadow-lg">
              <ShoppingCart className="h-12 w-12 text-fitnest-green" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Aucun produit trouvé</h3>
              <p className="text-base md:text-lg text-gray-600 max-w-md font-medium leading-relaxed">
                {searchQuery 
                  ? `Aucun produit ne correspond à "${searchQuery}". Essayez une autre recherche.`
                  : selectedCategoryName !== "all" 
                    ? `Aucun produit disponible dans cette catégorie. Essayez-en une autre.` 
                    : "Aucun produit disponible pour le moment. Revenez plus tard."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {selectedCategoryName !== "all" && (
                <Link href="/express-shop">
                  <Button 
                    className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <span>Tous les Produits</span>
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              <Link href="/meal-plans">
                <Button 
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-fitnest-orange hover:text-fitnest-orange font-bold px-8 py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <span>Browse Meal Plans</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && totalPages > 1 && (
          <div className="mt-12 max-w-6xl mx-auto flex justify-center items-center gap-2">
            {/* Previous Button */}
            <Link 
              href={`/express-shop?${new URLSearchParams({
                ...(selectedCategoryName !== 'all' && { category: selectedCategoryName }),
                ...(searchQuery && { search: searchQuery }),
                page: Math.max(1, currentPage - 1).toString()
              }).toString()}`}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            >
              <Button 
                variant="outline"
                className="border-2 border-gray-200 hover:border-fitnest-green hover:bg-fitnest-green hover:text-white font-semibold rounded-xl transition-all duration-300"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>
            </Link>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                
                const showEllipsis = 
                  (page === 2 && currentPage > 3) || 
                  (page === totalPages - 1 && currentPage < totalPages - 2)

                if (!showPage && !showEllipsis) return null

                if (showEllipsis) {
                  return (
                    <span key={page} className="px-3 py-2 text-gray-400">
                      ...
                    </span>
                  )
                }

                if (!showPage) return null

                return (
                  <Link
                    key={page}
                    href={`/express-shop?${new URLSearchParams({
                      ...(selectedCategoryName !== 'all' && { category: selectedCategoryName }),
                      ...(searchQuery && { search: searchQuery }),
                      page: page.toString()
                    }).toString()}`}
                  >
                    <Button
                      variant={currentPage === page ? 'default' : 'outline'}
                      className={`font-semibold rounded-xl transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-fitnest-green to-fitnest-green/90 text-white border-0 shadow-lg'
                          : 'border-2 border-gray-200 hover:border-fitnest-green hover:bg-fitnest-green/10'
                      }`}
                    >
                      {page}
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* Next Button */}
            <Link 
              href={`/express-shop?${new URLSearchParams({
                ...(selectedCategoryName !== 'all' && { category: selectedCategoryName }),
                ...(searchQuery && { search: searchQuery }),
                page: Math.min(totalPages, currentPage + 1).toString()
              }).toString()}`}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            >
              <Button 
                variant="outline"
                className="border-2 border-gray-200 hover:border-fitnest-green hover:bg-fitnest-green hover:text-white font-semibold rounded-xl transition-all duration-300"
                disabled={currentPage === totalPages}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {/* Promotional CTA Section */}
        {products.length > 0 && (
          <div className="mt-16 md:mt-20 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* CTA Card 1 */}
              <div className="rounded-3xl bg-white border-2 border-gray-100 p-8 shadow-lg hover:shadow-2xl hover:border-fitnest-green hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-fitnest-green/10 to-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6 text-fitnest-green" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Des Meal Plans Complets
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  À la recherche d'une solution nutritionnelle complète ? Optez pour nos Meal Plans, avec des plats frais et préparés, livrés quotidiennement.
                </p>
                <Link href="/meal-plans">
                  <Button 
                    className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn w-full sm:w-auto"
                  >
                    <span>Voir les Meal Plans</span>
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              {/* CTA Card 2 */}
              <div className="rounded-3xl bg-white border-2 border-gray-100 p-8 shadow-lg hover:shadow-2xl hover:border-fitnest-orange hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-fitnest-orange/10 to-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-fitnest-orange" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Besoin d'aide
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Nos experts en nutrition vous accompagnent pour trouver le meal plan idéal, afin d'équilibrer vos macronutriments et atteindre vos objectifs fitness.
                </p>
                <Link href="/contact">
                  <Button 
                    className="bg-gradient-to-r from-fitnest-orange to-orange-500 hover:from-orange-500 hover:to-fitnest-orange text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn w-full sm:w-auto"
                  >
                    <span>Nous Contacter</span>
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
