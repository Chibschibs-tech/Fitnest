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
      <TabsList className="flex-wrap h-auto p-1">
        {categories.map((category) => (
          <TabsTrigger 
            key={category} 
            value={category} 
            className="capitalize data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            {category === "all" ? "All Products" : category.replace(/_/g, " ").replace(/-/g, " ")}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

