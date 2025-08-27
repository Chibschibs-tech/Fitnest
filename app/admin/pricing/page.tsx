"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Calculator, CheckCircle, AlertCircle } from "lucide-react"

interface MealPrice {
  id: number
  plan_name: string
  meal_type: string
  base_price_mad: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface DiscountRule {
  id: number
  discount_type: string
  condition_value: number
  discount_percentage: number
  stackable: boolean
  is_active: boolean
  valid_from: string | null
  valid_to: string | null
  created_at: string
  updated_at: string
}

interface PriceCalculation {
  currency: string
  pricePerDay: number
  grossWeekly: number
  discountsApplied: Array<{
    type: string
    condition: number
    percentage: number
    amount: number
  }>
  finalWeekly: number
  durationWeeks: number
  totalRoundedMAD: number
  breakdown: {
    plan: string
    meals: string[]
    days: number
    mealPrices: Array<{
      meal: string
      price: number
    }>
  }
}

export default function PricingPage() {
  const [mealPrices, setMealPrices] = useState<MealPrice[]>([])
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Price simulator state
  const [simulatorData, setSimulatorData] = useState({
    plan: "",
    meals: [] as string[],
    days: 5,
    duration: 4,
  })
  const [calculationResult, setCalculationResult] = useState<PriceCalculation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Form states
  const [newMealPrice, setNewMealPrice] = useState({
    plan_name: "",
    meal_type: "",
    base_price_mad: 0,
  })
  const [newDiscountRule, setNewDiscountRule] = useState({
    discount_type: "",
    condition_value: 0,
    discount_percentage: 0,
    stackable: true,
    valid_from: "",
    valid_to: "",
  })

  const [editingMealPrice, setEditingMealPrice] = useState<MealPrice | null>(null)
  const [editingDiscountRule, setEditingDiscountRule] = useState<DiscountRule | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [mealPricesRes, discountRulesRes] = await Promise.all([
        fetch("/api/admin/pricing/meal-prices"),
        fetch("/api/admin/pricing/discount-rules"),
      ])

      const mealPricesData = await mealPricesRes.json()
      const discountRulesData = await discountRulesRes.json()

      setMealPrices(mealPricesData.mealPrices || [])
      setDiscountRules(discountRulesData.discountRules || [])
    } catch (err) {
      setError("Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePrice = async () => {
    if (!simulatorData.plan || simulatorData.meals.length === 0) {
      setError("Please select a plan and at least one meal")
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      const response = await fetch("/api/calculate-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(simulatorData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate price")
      }

      setCalculationResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed")
    } finally {
      setIsCalculating(false)
    }
  }

  const createMealPrice = async () => {
    try {
      const response = await fetch("/api/admin/pricing/meal-prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMealPrice),
      })

      if (response.ok) {
        fetchData()
        setNewMealPrice({ plan_name: "", meal_type: "", base_price_mad: 0 })
      }
    } catch (err) {
      setError("Failed to create meal price")
    }
  }

  const createDiscountRule = async () => {
    try {
      const response = await fetch("/api/admin/pricing/discount-rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newDiscountRule,
          valid_from: newDiscountRule.valid_from || null,
          valid_to: newDiscountRule.valid_to || null,
        }),
      })

      if (response.ok) {
        fetchData()
        setNewDiscountRule({
          discount_type: "",
          condition_value: 0,
          discount_percentage: 0,
          stackable: true,
          valid_from: "",
          valid_to: "",
        })
      }
    } catch (err) {
      setError("Failed to create discount rule")
    }
  }

  const deleteMealPrice = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/pricing/meal-prices/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchData()
      }
    } catch (err) {
      setError("Failed to delete meal price")
    }
  }

  const deleteDiscountRule = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/pricing/discount-rules/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchData()
      }
    } catch (err) {
      setError("Failed to delete discount rule")
    }
  }

  const updateMealPrice = async () => {
    if (!editingMealPrice) return

    try {
      const response = await fetch(`/api/admin/pricing/meal-prices/${editingMealPrice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingMealPrice),
      })

      if (response.ok) {
        fetchData()
        setEditingMealPrice(null)
      }
    } catch (err) {
      setError("Failed to update meal price")
    }
  }

  const updateDiscountRule = async () => {
    if (!editingDiscountRule) return

    try {
      const response = await fetch(`/api/admin/pricing/discount-rules/${editingDiscountRule.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingDiscountRule,
          valid_from: editingDiscountRule.valid_from || null,
          valid_to: editingDiscountRule.valid_to || null,
        }),
      })

      if (response.ok) {
        fetchData()
        setEditingDiscountRule(null)
      }
    } catch (err) {
      setError("Failed to update discount rule")
    }
  }

  const handleMealSelection = (meal: string, checked: boolean) => {
    if (checked) {
      setSimulatorData((prev) => ({
        ...prev,
        meals: [...prev.meals, meal],
      }))
    } else {
      setSimulatorData((prev) => ({
        ...prev,
        meals: prev.meals.filter((m) => m !== meal),
      }))
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Pricing Management</h1>
          <p className="text-gray-600 mt-2">Manage meal prices, discount rules, and test pricing calculations</p>
        </div>

        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="simulator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="simulator">Price Simulator</TabsTrigger>
            <TabsTrigger value="meal-prices">Meal Prices</TabsTrigger>
            <TabsTrigger value="discount-rules">Discount Rules</TabsTrigger>
          </TabsList>

          {/* Price Simulator */}
          <TabsContent value="simulator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Price Calculator
                  </CardTitle>
                  <CardDescription>Test pricing calculations with different parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="plan">Plan</Label>
                    <Select
                      value={simulatorData.plan}
                      onValueChange={(value) => setSimulatorData((prev) => ({ ...prev, plan: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                        <SelectItem value="Stay Fit">Stay Fit</SelectItem>
                        <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Meals</Label>
                    <div className="space-y-2 mt-2">
                      {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                        <div key={meal} className="flex items-center space-x-2">
                          <Checkbox
                            id={meal}
                            checked={simulatorData.meals.includes(meal)}
                            onCheckedChange={(checked) => handleMealSelection(meal, checked as boolean)}
                          />
                          <Label htmlFor={meal}>{meal}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="days">Days per week</Label>
                    <Input
                      id="days"
                      type="number"
                      min="1"
                      max="7"
                      value={simulatorData.days}
                      onChange={(e) =>
                        setSimulatorData((prev) => ({
                          ...prev,
                          days: Number.parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (weeks)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={simulatorData.duration}
                      onChange={(e) =>
                        setSimulatorData((prev) => ({
                          ...prev,
                          duration: Number.parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>

                  <Button onClick={calculatePrice} disabled={isCalculating} className="w-full">
                    {isCalculating ? "Calculating..." : "Calculate Price"}
                  </Button>
                </CardContent>
              </Card>

              {calculationResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Calculation Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Price per day</Label>
                        <p className="text-lg font-semibold">{calculationResult.pricePerDay} MAD</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Gross weekly</Label>
                        <p className="text-lg font-semibold">{calculationResult.grossWeekly} MAD</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Final weekly</Label>
                        <p className="text-lg font-semibold text-green-600">{calculationResult.finalWeekly} MAD</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Total ({calculationResult.durationWeeks} weeks)</Label>
                        <p className="text-2xl font-bold text-green-600">{calculationResult.totalRoundedMAD} MAD</p>
                      </div>
                    </div>

                    {calculationResult.discountsApplied.length > 0 && (
                      <div>
                        <Label className="text-sm text-gray-600">Discounts Applied</Label>
                        <div className="space-y-2 mt-2">
                          {calculationResult.discountsApplied.map((discount, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <Badge variant="secondary">
                                {discount.type === "days_per_week"
                                  ? `${discount.condition} days/week`
                                  : `${discount.condition} weeks`}
                              </Badge>
                              <span className="text-sm">
                                -{(discount.percentage * 100).toFixed(1)}% (-{discount.amount.toFixed(2)} MAD)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm text-gray-600">Meal Breakdown</Label>
                      <div className="space-y-1 mt-2">
                        {calculationResult.breakdown.mealPrices.map((meal, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{meal.meal}</span>
                            <span>{meal.price} MAD</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Meal Prices */}
          <TabsContent value="meal-prices">
            <Card>
              <CardHeader>
                <CardTitle>Meal Type Prices</CardTitle>
                <CardDescription>Manage base prices for each plan and meal type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Meal Price
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Meal Price</DialogTitle>
                        <DialogDescription>Create a new meal price for a specific plan and meal type</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-plan">Plan Name</Label>
                          <Select
                            value={newMealPrice.plan_name}
                            onValueChange={(value) => setNewMealPrice((prev) => ({ ...prev, plan_name: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                              <SelectItem value="Stay Fit">Stay Fit</SelectItem>
                              <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="new-meal-type">Meal Type</Label>
                          <Select
                            value={newMealPrice.meal_type}
                            onValueChange={(value) => setNewMealPrice((prev) => ({ ...prev, meal_type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select meal type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Breakfast">Breakfast</SelectItem>
                              <SelectItem value="Lunch">Lunch</SelectItem>
                              <SelectItem value="Dinner">Dinner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="new-price">Base Price (MAD)</Label>
                          <Input
                            id="new-price"
                            type="number"
                            step="0.01"
                            value={newMealPrice.base_price_mad}
                            onChange={(e) =>
                              setNewMealPrice((prev) => ({
                                ...prev,
                                base_price_mad: Number.parseFloat(e.target.value) || 0,
                              }))
                            }
                          />
                        </div>
                        <Button onClick={createMealPrice} className="w-full">
                          Create Meal Price
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Meal Type</TableHead>
                      <TableHead>Price (MAD)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mealPrices.map((price) => (
                      <TableRow key={price.id}>
                        <TableCell>{price.plan_name}</TableCell>
                        <TableCell>{price.meal_type}</TableCell>
                        <TableCell>{price.base_price_mad}</TableCell>
                        <TableCell>
                          <Badge variant={price.is_active ? "default" : "secondary"}>
                            {price.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingMealPrice(price)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteMealPrice(price.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discount Rules */}
          <TabsContent value="discount-rules">
            <Card>
              <CardHeader>
                <CardTitle>Discount Rules</CardTitle>
                <CardDescription>Manage discount rules based on days per week and duration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Discount Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Discount Rule</DialogTitle>
                        <DialogDescription>Create a new discount rule</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-discount-type">Discount Type</Label>
                          <Select
                            value={newDiscountRule.discount_type}
                            onValueChange={(value) => setNewDiscountRule((prev) => ({ ...prev, discount_type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="days_per_week">Days per Week</SelectItem>
                              <SelectItem value="duration_weeks">Duration Weeks</SelectItem>
                              <SelectItem value="special_offer">Special Offer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="new-condition">Condition Value</Label>
                          <Input
                            id="new-condition"
                            type="number"
                            value={newDiscountRule.condition_value}
                            onChange={(e) =>
                              setNewDiscountRule((prev) => ({
                                ...prev,
                                condition_value: Number.parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-percentage">Discount Percentage (0.10 = 10%)</Label>
                          <Input
                            id="new-percentage"
                            type="number"
                            step="0.01"
                            value={newDiscountRule.discount_percentage}
                            onChange={(e) =>
                              setNewDiscountRule((prev) => ({
                                ...prev,
                                discount_percentage: Number.parseFloat(e.target.value) || 0,
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="new-stackable"
                            checked={newDiscountRule.stackable}
                            onCheckedChange={(checked) =>
                              setNewDiscountRule((prev) => ({
                                ...prev,
                                stackable: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="new-stackable">Stackable</Label>
                        </div>
                        <div>
                          <Label htmlFor="new-valid-from">Valid From (optional)</Label>
                          <Input
                            id="new-valid-from"
                            type="datetime-local"
                            value={newDiscountRule.valid_from}
                            onChange={(e) =>
                              setNewDiscountRule((prev) => ({
                                ...prev,
                                valid_from: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-valid-to">Valid To (optional)</Label>
                          <Input
                            id="new-valid-to"
                            type="datetime-local"
                            value={newDiscountRule.valid_to}
                            onChange={(e) =>
                              setNewDiscountRule((prev) => ({
                                ...prev,
                                valid_to: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <Button onClick={createDiscountRule} className="w-full">
                          Create Discount Rule
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Discount %</TableHead>
                      <TableHead>Stackable</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discountRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>{rule.discount_type}</TableCell>
                        <TableCell>{rule.condition_value}</TableCell>
                        <TableCell>{(rule.discount_percentage * 100).toFixed(1)}%</TableCell>
                        <TableCell>
                          <Badge variant={rule.stackable ? "default" : "secondary"}>
                            {rule.stackable ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.is_active ? "default" : "secondary"}>
                            {rule.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {rule.valid_from && rule.valid_to ? (
                            <div>
                              <div>From: {new Date(rule.valid_from).toLocaleDateString()}</div>
                              <div>To: {new Date(rule.valid_to).toLocaleDateString()}</div>
                            </div>
                          ) : (
                            "Always"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingDiscountRule(rule)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteDiscountRule(rule.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Meal Price Dialog */}
        {editingMealPrice && (
          <Dialog open={!!editingMealPrice} onOpenChange={() => setEditingMealPrice(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Meal Price</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Plan Name</Label>
                  <Input
                    value={editingMealPrice.plan_name}
                    onChange={(e) =>
                      setEditingMealPrice((prev) =>
                        prev
                          ? {
                              ...prev,
                              plan_name: e.target.value,
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Meal Type</Label>
                  <Input
                    value={editingMealPrice.meal_type}
                    onChange={(e) =>
                      setEditingMealPrice((prev) =>
                        prev
                          ? {
                              ...prev,
                              meal_type: e.target.value,
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Base Price (MAD)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingMealPrice.base_price_mad}
                    onChange={(e) =>
                      setEditingMealPrice((prev) =>
                        prev
                          ? {
                              ...prev,
                              base_price_mad: Number.parseFloat(e.target.value) || 0,
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={editingMealPrice.is_active}
                    onCheckedChange={(checked) =>
                      setEditingMealPrice((prev) =>
                        prev
                          ? {
                              ...prev,
                              is_active: checked as boolean,
                            }
                          : null,
                      )
                    }
                  />
                  <Label>Active</Label>
                </div>
                <Button onClick={updateMealPrice} className="w-full">
                  Update Meal Price
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Discount Rule Dialog */}
        {editingDiscountRule && (
          <Dialog open={!!editingDiscountRule} onOpenChange={() => setEditingDiscountRule(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Discount Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Discount Type</Label>
                  <Select
                    value={editingDiscountRule.discount_type}
                    onValueChange={(value) =>
                      setEditingDiscountRule((prev) =>
                        prev
                          ? {
                              ...prev,
                              discount_type: value,
                            }
                          : null,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days_per_week">Days per Week</SelectItem>
                      <SelectItem value="duration_weeks">Duration Weeks</SelectItem>
                      <SelectItem value="special_offer">Special Offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condition Value</Label>
                  <Input
                    type="number"
                    value={editingDiscountRule.condition_value}
                    onChange={(e) =>
                      setEditingDiscountRule((prev) =>
                        prev
                          ? {
                              ...prev,
                              condition_value: Number.parseInt(e.target.value) || 0,
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Discount Percentage</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingDiscountRule.discount_percentage}
                    onChange={(e) =>
                      setEditingDiscountRule((prev) =>
                        prev
                          ? {
                              ...prev,
                              discount_percentage: Number.parseFloat(e.target.value) || 0,
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={editingDiscountRule.stackable}
                    onCheckedChange={(checked) =>
                      setEditingDiscountRule((prev) =>
                        prev
                          ? {
                              ...prev,
                              stackable: checked as boolean,
                            }
                          : null,
                      )
                    }
                  />
                  <Label>Stackable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={editingDiscountRule.is_active}
                    onCheckedChange={(checked) =>
                      setEditingDiscountRule((prev) =>
                        prev
                          ? {
                              ...prev,
                              is_active: checked as boolean,
                            }
                          : null,
                      )
                    }
                  />
                  <Label>Active</Label>
                </div>
                <div>
                  <Label>Valid From</Label>
                  <Input
                    type="datetime-local"
                    value={editingDiscountRule.valid_from || ""}
                    onChange={(e) =>
                      setEditingDiscountRule((prev) =>
                        prev
                          ? {
                              ...prev,
                              valid_from: e.target.value || null,
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label>Valid To</Label>
                  <Input
                    type="datetime-local"
                    value={editingDiscountRule.valid_to || ""}
                    onChange={(e) =>
                      setEditingDiscountRule((prev) =>
                        prev
                          ? {
                              ...prev,
                              valid_to: e.target.value || null,
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <Button onClick={updateDiscountRule} className="w-full">
                  Update Discount Rule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
