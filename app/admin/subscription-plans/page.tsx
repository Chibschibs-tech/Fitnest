"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus, Settings } from "lucide-react"
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
  monthly_revenue: number
  product_name: string
  product_slug: string
}

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/admin/subscription-plans")
      const data = await response.json()
      setPlans(data.plans || [])
    } catch (error) {
      console.error("Error fetching plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const deletePlan = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    try {
      const response = await fetch(`/api/admin/subscription-plans/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPlans()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete plan")
      }
    } catch (error) {
      console.error("Error deleting plan:", error)
      alert("Failed to delete plan")
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
        <Button asChild>
          <Link href="/admin/subscription-plans/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Link>
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No subscription plans found</h3>
            <p className="text-gray-600 mb-4">Create your first subscription plan to get started.</p>
            <Button asChild>
              <Link href="/admin/init-subscription-plans">Initialize Plans</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{plans.length}</div>
                <div className="text-sm text-gray-600">Total Plans</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{plans.filter((p) => p.is_active).length}</div>
                <div className="text-sm text-gray-600">Active Plans</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {plans.reduce((sum, p) => sum + Number.parseInt(p.subscriber_count.toString()), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Subscribers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {plans.reduce((sum, p) => sum + Number.parseFloat(p.monthly_revenue.toString()), 0).toFixed(0)} MAD
                </div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Billing</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Subscribers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-gray-600">{plan.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{plan.billing_period}</Badge>
                      </TableCell>
                      <TableCell>{plan.price} MAD</TableCell>
                      <TableCell>{plan.item_count} items</TableCell>
                      <TableCell>{plan.subscriber_count}</TableCell>
                      <TableCell>
                        <Badge variant={plan.is_active ? "default" : "secondary"}>
                          {plan.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/subscription-plans/${plan.id}/items`}>
                              <Settings className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/subscription-plans/${plan.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePlan(plan.id)}
                            disabled={Number.parseInt(plan.subscriber_count.toString()) > 0}
                          >
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
        </div>
      )}
    </div>
  )
}
