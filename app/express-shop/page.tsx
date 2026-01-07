import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Sparkles, Tag, ChevronRight, ShoppingBag, Zap, TrendingUp, Package } from "lucide-react"
import { CategoryFilter } from "./category-filter"
import { Suspense } from "react"

interface Product {
  id: string
  name: string
  description: string
  image: string
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

async function getProducts(categoryId?: string): Promise<Product[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
  
  try {
    // Build URL with category parameter if provided
    const url = new URL(`${API_BASE}/products/express-shop`)
    url.searchParams.set('status', 'active')
    if (categoryId && categoryId !== 'all') {
      url.searchParams.set('category', categoryId)
    }
    
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle different API response structures
    return Array.isArray(data.data) ? data.data : data
  } catch (error) {
    console.error('Failed to fetch products:', error)
    // Return fallback data in case of error
    return []
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
  searchParams: { category?: string }
}

export default async function ExpressShop({ searchParams }: ExpressShopProps) {
  // Get selected category ID from search params
  const selectedCategoryId = (await searchParams).category || "all"
  
  // Fetch categories first, then products with the selected category
  const categories = await getCategories()
  const products = await getProducts(selectedCategoryId)
  
  // Find the selected category name for display
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId)
  const selectedCategoryName = selectedCategory?.name || "all"

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

        {/* Category Filter */}
        <div className="mb-6 max-w-6xl mx-auto">
          <Suspense fallback={<div className="h-12 w-full rounded-xl bg-gray-200 animate-pulse" />}>
            <CategoryFilter categories={categories} activeCategory={selectedCategoryId} />
          </Suspense>
        </div>

        {/* Results Count */}
        {products.length > 0 && (
          <div className="mb-8 max-w-6xl mx-auto px-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                {products.length}{" "}
                {products.length === 1 ? "Produit" : "Produits"}
                {selectedCategoryId !== "all" && (
                  <span className="text-fitnest-orange"> dans {selectedCategoryName}</span>
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
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">No products found</h3>
              <p className="text-base md:text-lg text-gray-600 max-w-md font-medium leading-relaxed">
                {selectedCategoryId !== "all" 
                  ? `No products available in this category. Try selecting a different one.` 
                  : "No products available at the moment. Please check back later."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {selectedCategoryId !== "all" && (
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
            {products.map((product) => {
              const hasDiscount = product.price?.discount > 0 && product.price?.base > product.price?.discount
              const displayPrice = hasDiscount ? product.price.discount : product.price?.base || 0
              const isOutOfStock = product.stock_quantity <= 0

              return (
                <Card 
                  key={product.id} 
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
                >
                  <Link href={`/express-shop/${product.id}`}>
                    <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {product.image ? (
                        <Image
                          src={product?.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingCart className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                        {isOutOfStock && (
                          <Badge className="bg-red-500 text-white border-0 font-bold shadow-lg text-xs">
                            Out of Stock
                          </Badge>
                        )}
                        {hasDiscount && !isOutOfStock && (
                          <Badge className="bg-gradient-to-r from-fitnest-orange to-orange-500 text-white border-0 font-bold shadow-lg flex items-center gap-1 text-xs">
                            <Tag className="h-3 w-3" />
                            Sale
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <h3 className="line-clamp-2 text-lg font-bold text-white">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                  
                  <CardHeader className="flex-shrink-0 p-4 pb-2">
                    {product.description && (
                      <CardDescription className="line-clamp-2 text-sm text-gray-600">
                        {product.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-shrink-0 px-4 pb-3">
                    {/* Stock Warning */}
                    {!isOutOfStock && product.stock_quantity <= 5 && (
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-fitnest-orange">
                        <div className="h-1.5 w-1.5 rounded-full bg-fitnest-orange animate-pulse" />
                        Only {product.stock_quantity} left!
                      </div>
                    )}
                    
                    {/* Price Display */}
                    <div className="p-3 bg-gradient-to-br from-fitnest-green/5 to-fitnest-orange/5 rounded-xl border border-fitnest-green/10">
                      <div className="flex items-baseline justify-center gap-1.5">
                        {hasDiscount ? (
                          <>
                            <span className="text-2xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                              {displayPrice}
                            </span>
                            <span className="text-xs text-gray-600 font-medium">MAD</span>
                            <span className="text-xs text-gray-500 line-through ml-1">
                              {product.price.base}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                              {displayPrice}
                            </span>
                            <span className="text-xs text-gray-600 font-medium">MAD</span>
                          </>
                        )}
                      </div>
                      {hasDiscount && (
                        <div className="text-center mt-1">
                          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-fitnest-orange">
                            Save {Math.round(((product.price.base - product.price.discount) / product.price.base) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="mt-auto p-4 pt-0">
                    <Link href={`/express-shop/${product.id}`} className="w-full">
                      <Button 
                        className={`w-full ${
                          isOutOfStock 
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white'
                        } font-bold text-sm py-3 rounded-xl shadow-lg transition-all duration-300 group/btn`}
                        disabled={isOutOfStock}
                      >
                        {isOutOfStock ? (
                          <span>Out of Stock</span>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                            <span>Ajouter au Panier</span>
                            <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
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
