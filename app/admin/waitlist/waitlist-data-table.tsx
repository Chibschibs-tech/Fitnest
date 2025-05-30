"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface WaitlistSubmission {
  id: number
  name: string
  email: string
  phone?: string
  meal_plan_preference?: string
  city?: string
  notifications: boolean
  created_at: string
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
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
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{submissions.length} submissions found</p>
        <div className="space-x-2">
          <Button onClick={fetchSubmissions} variant="outline">
            Refresh
          </Button>
          <Button onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Phone</th>
              <th className="border px-4 py-2 text-left">Meal Plan</th>
              <th className="border px-4 py-2 text-left">City</th>
              <th className="border px-4 py-2 text-center">Notifications</th>
              <th className="border px-4 py-2 text-left">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{submission.name}</td>
                <td className="border px-4 py-2">{submission.email}</td>
                <td className="border px-4 py-2">{submission.phone || "-"}</td>
                <td className="border px-4 py-2">{submission.meal_plan_preference || "-"}</td>
                <td className="border px-4 py-2">{submission.city || "-"}</td>
                <td className="border px-4 py-2 text-center">{submission.notifications ? "Yes" : "No"}</td>
                <td className="border px-4 py-2">{formatDate(submission.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
