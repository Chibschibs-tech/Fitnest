"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Eye, Trash2 } from "lucide-react"

interface MealPlan {
  id: number
  name: string
  description: string
  weeklyPrice: number
  type: string
  caloriesMin?: number
  caloriesMax?: number
  active: boolean
  createdAt: string
}

export default function MealPlansContent() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMealPlans()
  }, [])

  const fetchMealPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/products/meal-plans")
      if (!response.ok) {
        throw new Error("Failed to fetch meal plans")
      }
      const data = await response.json()
      setMealPlans(data)
    } catch (error) {
      console.error("Error fetching meal plans:", error)
      setError("Failed to load meal plans")
    } finally {
      setLoading(false)
    }
  }

  const filteredMealPlans = mealPlans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      weight_loss: "bg-red-100 text-red-800",
      muscle_gain: "bg-blue-100 text-blue-800",
      keto: "bg-green-100 text-green-800",
      balanced: "bg-purple-100 text-purple-800",
      custom: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {type.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading meal plans...</div>
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchMealPlans}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{mealPlans.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{mealPlans.filter((p) => p.active).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                mealPlans.reduce((sum, p) => sum + Number(p.weeklyPrice), 0) / Math.max(mealPlans.length, 1),
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Plan Types</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{new Set(mealPlans.map((p) => p.type)).size}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search meal plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Meal Plan
        </Button>
      </div>

      {/* Meal Plans Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Calories Range</TableHead>
              <TableHead>Weekly Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMealPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{plan.description}</div>
                  </div>
                </TableCell>
                <TableCell>{getTypeBadge(plan.type)}</TableCell>
                <TableCell>
                  {plan.caloriesMin && plan.caloriesMax ? (
                    <span className="text-sm">
                      {plan.caloriesMin} - {plan.caloriesMax} cal
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Not specified</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(Number(plan.weeklyPrice))}</TableCell>
                <TableCell>
                  <Badge variant={plan.active ? "default" : "secondary"}>{plan.active ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell>{new Date(plan.createdAt).toLocaleDateString()}</TableCell>
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
      </Card>
    </div>
  )
}
