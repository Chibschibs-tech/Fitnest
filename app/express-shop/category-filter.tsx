"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === "all") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/express-shop?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
      <TabsList className="flex-wrap h-auto p-2 bg-white shadow-md rounded-2xl border-2 border-gray-100">
        {categories.map((category) => (
          <TabsTrigger 
            key={category} 
            value={category} 
            className="capitalize px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fitnest-green data-[state=active]:to-fitnest-green/90 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-50"
          >
            {category === "all" ? "All Products" : category.replace(/_/g, " ").replace(/-/g, " ")}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

