import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ExternalLink } from "lucide-react"

type Subscription = {
  id: number
  status: string | null
  planId: number | null
  planName: string | null
  createdAt: string | null
  totalAmount: number | null
}

async function getSubscriptions(): Promise<Subscription[]> {
  const res = await fetch("/api/user/subscriptions", { cache: "no-store" })
  if (res.status === 401) {
    // The dashboard wrapper already protects routes; just surface gracefully.
    notFound()
  }
  if (!res.ok) {
    return []
  }
  const json = await res.json()
  // The route returns { subscriptions }, but also support flat array just in case.
  return json.subscriptions ?? json ?? []
}

export default async function MyMealPlansPage() {
  const subscriptions = await getSubscriptions()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Meal Plans</h1>
        <p className="text-gray-600">Manage your active meal plan subscriptions</p>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscriptions</CardTitle>
            <CardDescription>You don{"'"}t have any active meal plans yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/meal-plans">
              <Button>Browse Meal Plans</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {subscriptions.map((sub) => {
            const amount =
              typeof sub.totalAmount === "number"
                ? sub.totalAmount >= 1000
                  ? (sub.totalAmount / 100).toFixed(2)
                  : (sub.totalAmount.toFixed?.(2) ?? `${sub.totalAmount}`)
                : "0"
            const created = sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "Unknown date"
            const isActive =
              (sub.status ?? "").toLowerCase() !== "canceled" && (sub.status ?? "").toLowerCase() !== "cancelled"

            return (
              <Card key={sub.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      {sub.planName || "Meal Plan"}
                    </CardTitle>
                    <CardDescription>Started on {created}</CardDescription>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {isActive ? "Active" : sub.status || "Inactive"}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Order ID</div>
                    <div className="font-medium">#{sub.id}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="font-medium">{amount} MAD</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Plan</div>
                    <div className="font-medium">{sub.planName || `Plan ${sub.planId ?? ""}`}</div>
                  </div>

                  <div className="mt-2 flex flex-col sm:flex-row gap-3">
                    <Link href={`/dashboard/orders/${sub.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Order Details <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button className="flex-1" variant="secondary" disabled>
                      Manage Deliveries (soon)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
