"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface Meal {
  id: number
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  category: string
  ingredients: string[]
  allergens: string[]
  price: number
  image_url?: string
  is_available: boolean
}

export function MealsContent() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/products/meals")
      if (!response.ok) {
        throw new Error("Failed to fetch meals")
      }
      const data = await response.json()
      setMeals(data.meals || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch meals")
    } finally {
      setLoading(false)
    }
  }

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch =
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || meal.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(meals.map((meal) => meal.category)))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meal Management</h1>
          <p className="text-gray-600">Manage your meal offerings</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Meal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meals ({filteredMeals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Macros (P/C/F)</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden">
                      <Image
                        src={meal.image_url || "/placeholder.svg?height=48&width=48"}
                        alt={meal.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{meal.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{meal.category}</Badge>
                  </TableCell>
                  <TableCell>{meal.calories} cal</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {meal.protein}g / {meal.carbs}g / {meal.fat}g
                    </div>
                  </TableCell>
                  <TableCell>{meal.price} MAD</TableCell>
                  <TableCell>
                    <Badge variant={meal.is_available ? "default" : "secondary"}>
                      {meal.is_available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredMeals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No meals found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
