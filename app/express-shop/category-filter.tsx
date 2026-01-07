"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter } from "lucide-react"

interface CategoryOption {
  id: string
  name: string
}

interface CategoryFilterProps {
  categories: CategoryOption[]
  activeCategory: string
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (categoryName: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Reset pagination when category changes
    params.delete("page")
    
    if (categoryName === "all") {
      params.delete("category")
    } else {
      params.set("category", categoryName)
    }
    router.push(`/express-shop?${params.toString()}`, { scroll: false })
  }

  const formatCategoryName = (name: string) => {
    if (name === "all") return "Toutes les catégories"
    return name.replace(/_/g, " ").replace(/-/g, " ")
  }

  const selectedCategory = categories.find(cat => cat.name === activeCategory)
  const displayName = selectedCategory ? formatCategoryName(selectedCategory.name) : "Toutes les catégories"

  return (
    <div className="flex items-center gap-3">
      <Select value={activeCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="h-11 w-[280px] bg-gray-50 border-0 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <SelectValue placeholder="Sélectionner une catégorie" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem 
              key={category.id} 
              value={category.name}
              className="capitalize cursor-pointer"
            >
              {formatCategoryName(category.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {activeCategory !== "all" && (
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-fitnest-green/10 text-fitnest-green rounded-lg">
          <span className="text-sm font-medium">
            {displayName}
          </span>
        </div>
      )}
    </div>
  )
}

