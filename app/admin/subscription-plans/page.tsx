"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users, DollarSign, Package } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  product_name: string
  product_slug: string
  featured_image_url?: string
  item_count: number
  subscriber_count: number
  monthly_revenue: number
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
      setError("Failed to fetch subscription plans")
    } finally {
      setLoading(false)
    }
  }

  const deletePlan = async (planId: number) => {
    if (!confirm("Are you sure you want to delete this subscription plan?")) {
      return
    }

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
      alert("Failed to delete subscription plan")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading subscription plans...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-gray-600">Manage your subscription plans and their contents</p>
        </div>
        <Link href="/admin/subscription-plans/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </Link>
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
            <p className="text-gray-600 mb-4">
              Get started by creating your first subscription plan or initializing the system.
            </p>
            <div className="space-x-4">
              <Link href="/admin/init-subscription-plans">
                <Button variant="outline">Initialize System</Button>
              </Link>
              <Link href="/admin/subscription-plans/create">
                <Button>Create Plan</Button>
              </Link>
            </div>
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
                    <Link href={`/admin/subscription-plans/${plan.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
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
                      <div className="font-semibold">{plan.price} MAD</div>
                      <div className="text-sm text-gray-600">per {plan.billing_period}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-semibold">{plan.subscriber_count}</div>
                      <div className="text-sm text-gray-600">subscribers</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-semibold">{plan.item_count}</div>
                      <div className="text-sm text-gray-600">items included</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="font-semibold">{Number(plan.monthly_revenue).toFixed(2)} MAD</div>
                      <div className="text-sm text-gray-600">monthly revenue</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {plan.items_per_delivery} items per delivery • {plan.delivery_frequency} delivery
                      {plan.trial_period_days > 0 && ` • ${plan.trial_period_days} day trial`}
                    </div>
                    <Link href={`/admin/subscription-plans/${plan.id}/items`}>
                      <Button variant="outline" size="sm">
                        Manage Items
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
