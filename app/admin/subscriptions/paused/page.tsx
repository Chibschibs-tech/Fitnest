"use client"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/simple-auth"
import { PausedSubscriptionsContent } from "./paused-subscriptions-content"

interface PausedSubscription {
  id: number
  customer_name: string
  customer_email: string
  plan_name: string
  total_amount: number
  created_at: string
  paused_until: string
}

export const dynamic = "force-dynamic"

export default async function PausedSubscriptionsPage() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("session-id")?.value

  if (!sessionId) {
    redirect("/login?redirect=/admin/subscriptions/paused")
  }

  const user = await getSessionUser(sessionId)

  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin/subscriptions/paused")
  }

  return <PausedSubscriptionsContent />
}

// PausedSubscriptionsContent component can be defined here if needed
