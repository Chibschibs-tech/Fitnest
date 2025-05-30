"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, RefreshCw } from "lucide-react"

type WaitlistEntry = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  meal_plan: string
  city: string
  notifications: boolean
  created_at: string
}

export default function WaitlistDataTable() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWaitlistEntries = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/waitlist")
      const result = await response.json()

      if (result.success) {
        setEntries(result.data || [])
      } else {
        setError(result.error || "Failed to load waitlist entries")
      }
    } catch (err) {
      setError("An error occurred while fetching waitlist data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWaitlistEntries()
  }, [])

  const exportToCSV = () => {
    if (entries.length === 0) return

    // Create CSV content
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Meal Plan",
      "City",
      "Notifications",
      "Created At",
    ]
    const csvRows = [
      headers.join(","),
      ...entries.map((entry) =>
        [
          entry.id,
          `"${entry.first_name || ""}"`,
          `"${entry.last_name || ""}"`,
          `"${entry.email || ""}"`,
          `"${entry.phone || ""}"`,
          `"${entry.meal_plan || ""}"`,
          `"${entry.city || ""}"`,
          entry.notifications ? "Yes" : "No",
          entry.created_at,
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    // Create download link and trigger download
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `waitlist-entries-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">{entries.length} total entries</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchWaitlistEntries}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV} disabled={entries.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading waitlist data...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8">No waitlist entries found</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableCaption>List of all waitlist submissions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Meal Plan</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{`${entry.first_name || ""} ${entry.last_name || ""}`}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.phone || "N/A"}</TableCell>
                  <TableCell>{entry.meal_plan || "N/A"}</TableCell>
                  <TableCell>{entry.city || "N/A"}</TableCell>
                  <TableCell>{entry.notifications ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(entry.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
