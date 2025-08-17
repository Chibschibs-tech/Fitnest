"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Eye, Trash2, Package } from "lucide-react"

interface Meal {
  id: number
  name: string
  description: string
  price: number
  subscriptionPrice?: number
  category: string
  availability: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  active: boolean
  createdAt: string
}

export default function MealsContent() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

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
      setMeals(data)
    } catch (error) {
      console.error("Error fetching meals:", error)
      setError("Failed to load meals")
    } finally {
      setLoading(false)
    }
  }

  const filteredMeals = meals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      breakfast: "bg-yellow-100 text-yellow-800",
      lunch: "bg-green-100 text-green-800",
      dinner: "bg-blue-100 text-blue-800",
      snack: "bg-purple-100 text-purple-800",
      main: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge className={colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {category.toUpperCase()}
      </Badge>
    )
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "express_shop":
        return <Badge className="bg-green-100 text-green-800">Express Shop</Badge>
      case "subscription_only":
        return <Badge className="bg-blue-100 text-blue-800">Subscription Only</Badge>
      case "both":
        return <Badge className="bg-purple-100 text-purple-800">Both</Badge>
      default:
        return <Badge variant="outline">{availability}</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading meals...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchMeals}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{meals.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{meals.filter((m) => m.active).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Express Shop</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {meals.filter((m) => m.availability === "express_shop" || m.availability === "both").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(
                meals.filter((m) => m.calories).reduce((sum, m) => sum + (m.calories || 0), 0) /
                  Math.max(meals.filter((m) => m.calories).length, 1),
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Meal
        </Button>
      </div>

      {/* Meals Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meal Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Nutrition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMeals.map((meal) => (
              <TableRow key={meal.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{meal.name}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{meal.description}</div>
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(meal.category)}</TableCell>
                <TableCell>{getAvailabilityBadge(meal.availability)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{formatCurrency(Number(meal.price))}</div>
                    {meal.subscriptionPrice && (
                      <div className="text-sm text-gray-500">Sub: {formatCurrency(Number(meal.subscriptionPrice))}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {meal.calories ? (
                    <div className="text-sm">
                      <div>{meal.calories} cal</div>
                      <div className="text-gray-500">
                        P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Not specified</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={meal.active ? "default" : "secondary"}>{meal.active ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
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
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No meals found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "Start by adding your first meal."}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
