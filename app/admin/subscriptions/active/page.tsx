"use client"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { ActiveSubscriptionsContent } from "./active-subscriptions-content"

interface ActiveSubscription {
  id: number
  customer_name: string
  customer_email: string
  plan_name: string
  total_amount: number
  created_at: string
  delivery_frequency: string
  next_delivery: string
}

export const dynamic = "force-dynamic"

export default async function ActiveSubscriptionsPage() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session-id")?.value

  if (!sessionId) {
    redirect("/login?redirect=/admin/subscriptions/active")
  }

  const user = await getSessionUser(sessionId)

  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin/subscriptions/active")
  }

  return <ActiveSubscriptionsContent />
}
