import Link from "next/link"
import { Suspense } from "react"
import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { getSessionUser } from "@/lib/simple-auth"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, ExternalLink, CalendarDays } from "lucide-react"

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
const sql = DATABASE_URL ? neon(DATABASE_URL) : null

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
    if (!sql) return null

    const cookieStore = cookies()
    const sessionId = cookieStore.get("session-id")?.value
    if (!sessionId) return null

    const user = await getSessionUser(sessionId)
    if (!user) return null

    // Check if orders table exists
    const ordersReg = await sql`SELECT to_regclass('public.orders') AS regclass`
    if (!ordersReg[0]?.regclass) return []

    // Try with join to meal_plans for plan name; fallback without join
    let rows: any[] = []
    try {
      const plansReg = await sql`SELECT to_regclass('public.meal_plans') AS regclass`
      if (plansReg[0]?.regclass) {
        rows = await sql`
          SELECT o.id, o.user_id, o.status, o.plan_id, o.total_amount, o.created_at,
                 mp.name AS plan_name
          FROM orders o
          LEFT JOIN meal_plans mp ON o.plan_id = mp.id
          WHERE o.user_id = ${user.id} AND o.plan_id IS NOT NULL
          ORDER BY o.created_at DESC
        `
      } else {
        throw new Error("meal_plans table not found")
      }
    } catch {
      rows = await sql`
        SELECT id, user_id, status, plan_id, total_amount, created_at
        FROM orders
        WHERE user_id = ${user.id} AND plan_id IS NOT NULL
        ORDER BY created_at DESC
      `
    }

    return rows.map((r) => ({
      id: Number(r.id),
      status: r.status ?? "pending",
      planId: r.plan_id ?? null,
      planName: r.plan_name ?? null,
      totalAmount: r.total_amount ?? null,
      createdAt: r.created_at ? String(r.created_at) : null,
    }))
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
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
  const isActive = s !== "cancelled" && s !== "canceled" && s !== "failed" && s !== "paused"
  const isPaused = s === "paused"

  if (isPaused) {
    return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Paused</Badge>
  }

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
                    <Link href={`/dashboard/my-meal-plans/${sub.id}`}>
                      <Button variant="secondary" className="w-full">
                        Manage deliveries
                      </Button>
                    </Link>
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
      <Content />
    </Suspense>
  )
}
