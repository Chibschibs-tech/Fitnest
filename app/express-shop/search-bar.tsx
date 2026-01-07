"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "")
  }, [searchParams])

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Reset pagination when search changes
    params.delete("page")
    
    if (value.trim()) {
      params.set("search", value.trim())
    } else {
      params.delete("search")
    }
    
    router.push(`/express-shop?${params.toString()}`, { scroll: false })
  }

  const handleClear = () => {
    setSearchValue("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    params.delete("page")
    router.push(`/express-shop?${params.toString()}`, { scroll: false })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchValue)
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-11 w-full pl-10 pr-10 rounded-lg bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-fitnest-green/20 transition-all duration-200 text-sm placeholder:text-gray-400"
        />
        {searchValue && (
          <Button
            onClick={handleClear}
            variant="ghost"
            size="sm"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-200 rounded-md transition-colors"
          >
            <X className="h-3.5 w-3.5 text-gray-500" />
          </Button>
        )}
      </div>
    </div>
  )
}
