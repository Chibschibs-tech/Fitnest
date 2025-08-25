"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus, Edit, Trash2, Users, Package, DollarSign } from "lucide-react"
import Link from "next/link"

interface SubscriptionPlan {
  id: number
  name: string
  description: string
  billing_period: string
  price: number
  trial_period_days: number
  delivery_frequency: string
  items_per_delivery: number
  is_active: boolean
  item_count: number
  subscriber_count: number
  total_revenue: number
  created_at: string
}

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/admin/subscription-plans")
      const data = await response.json()

      if (response.ok) {
        setPlans(data.plans || [])
      } else {
        setError(data.error || "Failed to fetch plans")
      }
    } catch (err) {
      setError("Failed to fetch plans")
    } finally {
      setLoading(false)
    }
  }

  const deletePlan = async (planId: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    try {
      const response = await fetch(`/api/admin/subscription-plans/${planId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPlans(plans.filter((plan) => plan.id !== planId))
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete plan")
      }
    } catch (err) {
      alert("Failed to delete plan")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-gray-600">Manage your subscription plans and their contents.</p>
        </div>
        <Button asChild>
          <Link href="/admin/subscription-plans/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Link>
        </Button>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {plans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subscription plans found</h3>
            <p className="text-gray-600 mb-4">Create your first subscription plan to get started.</p>
            <Button asChild>
              <Link href="/admin/init-subscription-plans">Initialize Plans</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      <Badge variant={plan.is_active ? "default" : "secondary"}>
                        {plan.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{plan.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/subscription-plans/${plan.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePlan(plan.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-semibold">
                        {plan.price} MAD/{plan.billing_period}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Subscribers</p>
                      <p className="font-semibold">{plan.subscriber_count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Items</p>
                      <p className="font-semibold">{plan.item_count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-semibold">{plan.total_revenue} MAD</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/subscription-plans/${plan.id}/items`}>Manage Items</Link>
                  </Button>
                  <Badge variant="outline">{plan.delivery_frequency} delivery</Badge>
                  <Badge variant="outline">{plan.items_per_delivery} items per delivery</Badge>
                  {plan.trial_period_days > 0 && <Badge variant="outline">{plan.trial_period_days} day trial</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
