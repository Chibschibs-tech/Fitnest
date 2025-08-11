import Link from "next/link"
import { Suspense } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, ExternalLink, CalendarDays } from "lucide-react"

// Types must match what the API returns
type Subscription = {
  id: number
  status: string | null
  planId: number | null
  planName: string | null
  createdAt: string | null
  totalAmount: number | null
}

async function fetchSubscriptions(): Promise<Subscription[] | null> {
  try {
    // Relative URL automatically forwards cookies in App Router server components.
    const res = await fetch("/api/user/subscriptions", {
      cache: "no-store",
      // Avoid any accidental ISR from upstream
      next: { revalidate: 0 },
    })
    if (!res.ok) {
      // Gracefully handle API issues, don't throw (keeps us off the error boundary).
      return null
    }
    const json = await res.json()
    const subs: Subscription[] = json?.subscriptions ?? json ?? []
    return subs
  } catch {
    return null
  }
}

function formatMAD(amount: number | null): string {
  if (amount == null) return "0 MAD"
  // Some rows might store cents; keep it simple and readable
  const normalized = amount >= 1000 && amount % 100 === 0 ? amount / 100 : amount
  return `${Number(normalized).toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD`
}

function StatusPill({ status }: { status: string | null }) {
  const s = (status ?? "").toLowerCase()
  const isActive = s !== "cancelled" && s !== "canceled" && s !== "failed"
  return (
    <Badge
      className={
        isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"
      }
    >
      {isActive ? "Active" : status || "Inactive"}
    </Badge>
  )
}

async function Content() {
  const subscriptions = await fetchSubscriptions()

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Meal Plans</h1>
        <p className="text-muted-foreground">View and manage your active meal plan subscriptions.</p>
      </div>

      {!subscriptions ? (
        <Card>
          <CardHeader>
            <CardTitle>We couldn{"'"}t load your meal plans</CardTitle>
            <CardDescription>Please try again in a moment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Link href="/dashboard/my-meal-plans">
                <Button>Try again</Button>
              </Link>
              <Link href="/meal-plans">
                <Button variant="outline">Browse Meal Plans</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : subscriptions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscriptions</CardTitle>
            <CardDescription>You don{"'"}t have any active meal plan subscriptions yet.</CardDescription>
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
            const created = sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "Unknown"
            return (
              <Card key={sub.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      {sub.planName || (sub.planId ? `Plan ${sub.planId}` : "Meal Plan")}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Started on {created}
                    </CardDescription>
                  </div>
                  <StatusPill status={sub.status} />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-medium">#{sub.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{formatMAD(sub.totalAmount)}</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Link href={`/dashboard/orders/${sub.id}`}>
                      <Button variant="outline" className="w-full bg-transparent">
                        View order details
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="secondary" className="w-full" disabled>
                      Manage deliveries (coming soon)
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

export default function MyMealPlansPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading your meal plans…</CardTitle>
              <CardDescription>This will only take a second.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 animate-pulse rounded-md bg-muted" />
            </CardContent>
          </Card>
        </div>
      }
    >
      {/* Async server component content */}
      {/* @ts-expect-error Async Server Component */}
      <Content />
    </Suspense>
  )
}
