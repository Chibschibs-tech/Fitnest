"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"

interface Meal {
  id: number
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  price: number
  category: string
  image_url: string
  is_available: boolean
  created_at: string
}

export default function MealsContent() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    try {
      const response = await fetch("/api/admin/products/meals")
      if (response.ok) {
        const data = await response.json()
        setMeals(data.meals || [])
      } else {
        setError("Failed to load meals")
      }
    } catch (error) {
      console.error("Failed to fetch meals:", error)
      setError("Failed to load meals")
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (mealId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/meals/${mealId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_available: !currentStatus }),
      })

      if (response.ok) {
        setMeals(meals.map((meal) => (meal.id === mealId ? { ...meal, is_available: !currentStatus } : meal)))
      }
    } catch (error) {
      console.error("Failed to update meal status:", error)
    }
  }

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch =
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || meal.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(meals.map((meal) => meal.category)))]

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
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
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Meal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{meals.filter((meal) => meal.is_available).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{meals.filter((meal) => !meal.is_available).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length - 1}</div>
          </CardContent>
        </Card>
      </div>

      {/* Meals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Meals ({filteredMeals.length})</CardTitle>
          <CardDescription>Manage your meal offerings and their availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meal</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Nutrition</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {meal.image_url ? (
                            <img
                              src={meal.image_url || "/placeholder.svg"}
                              alt={meal.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">No Image</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{meal.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{meal.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{meal.calories} cal</div>
                        <div className="text-gray-500">
                          P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{meal.price} MAD</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={meal.is_available ? "default" : "secondary"}
                        className={meal.is_available ? "bg-green-100 text-green-800" : ""}
                      >
                        {meal.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAvailability(meal.id, meal.is_available)}
                        >
                          {meal.is_available ? "Disable" : "Enable"}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredMeals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No meals found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
