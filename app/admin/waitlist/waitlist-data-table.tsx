"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WaitlistSubmission {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  preferred_meal_plan: string | null
  city: string
  wants_notifications: boolean
  position: number
  status: string
  created_at: string
  contacted_at: string | null
  joined_at: string | null
}

export default function WaitlistDataTable() {
  const [submissions, setSubmissions] = useState<WaitlistSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/waitlist")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch waitlist submissions")
      }

      setSubmissions(data.submissions || [])
    } catch (err) {
      console.error("Error fetching waitlist data:", err)
      setError(err.message || "An error occurred while fetching waitlist data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleExport = () => {
    window.location.href = "/api/admin/waitlist/export"
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      waiting: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      joined: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
    }

    return <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>
  }

  const getMealPlanDisplay = (plan: string | null) => {
    if (!plan) return "-"

    const planNames = {
      "weight-loss": "Weight Loss",
      "muscle-gain": "Muscle Gain",
      "balanced-nutrition": "Balanced Nutrition",
      keto: "Keto",
      vegan: "Vegan",
    }

    return planNames[plan] || plan
  }

  if (loading) {
    return <div className="text-center py-8">Loading waitlist submissions...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchSubmissions}>Try Again</Button>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="mb-4">No waitlist submissions found.</p>
        <Button onClick={fetchSubmissions}>Refresh</Button>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Waitlist Submissions</h2>
          <p className="text-sm text-gray-500">{submissions.length} total submissions</p>
        </div>
        <div className="space-x-2">
          <Button onClick={fetchSubmissions} variant="outline">
            Refresh
          </Button>
          <Button onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-4 py-3 text-left font-medium">#</th>
              <th className="border px-4 py-3 text-left font-medium">Name</th>
              <th className="border px-4 py-3 text-left font-medium">Email</th>
              <th className="border px-4 py-3 text-left font-medium">Phone</th>
              <th className="border px-4 py-3 text-left font-medium">Meal Plan</th>
              <th className="border px-4 py-3 text-left font-medium">City</th>
              <th className="border px-4 py-3 text-center font-medium">Notifications</th>
              <th className="border px-4 py-3 text-center font-medium">Status</th>
              <th className="border px-4 py-3 text-left font-medium">Submitted</th>
              <th className="border px-4 py-3 text-left font-medium">Contacted</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="border px-4 py-3 font-mono text-sm">#{submission.position}</td>
                <td className="border px-4 py-3">
                  <div className="font-medium">
                    {submission.first_name} {submission.last_name}
                  </div>
                </td>
                <td className="border px-4 py-3">
                  <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                    {submission.email}
                  </a>
                </td>
                <td className="border px-4 py-3">
                  <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
                    {submission.phone}
                  </a>
                </td>
                <td className="border px-4 py-3">{getMealPlanDisplay(submission.preferred_meal_plan)}</td>
                <td className="border px-4 py-3 capitalize">{submission.city}</td>
                <td className="border px-4 py-3 text-center">
                  {submission.wants_notifications ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">✗</span>
                  )}
                </td>
                <td className="border px-4 py-3 text-center">{getStatusBadge(submission.status)}</td>
                <td className="border px-4 py-3 text-sm">{formatDate(submission.created_at)}</td>
                <td className="border px-4 py-3 text-sm">{formatDate(submission.contacted_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Submissions:</span>
            <span className="ml-2 font-medium">{submissions.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Waiting:</span>
            <span className="ml-2 font-medium">{submissions.filter((s) => s.status === "waiting").length}</span>
          </div>
          <div>
            <span className="text-gray-600">Contacted:</span>
            <span className="ml-2 font-medium">{submissions.filter((s) => s.status === "contacted").length}</span>
          </div>
          <div>
            <span className="text-gray-600">Joined:</span>
            <span className="ml-2 font-medium">{submissions.filter((s) => s.status === "joined").length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
